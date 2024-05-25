/**
 * 根据模板导出word（仅支持docx格式）
 * 适配图片 尺寸按比例缩放
 * 
 */

/**
 * 坑1 避免使用小驼峰命名
 * 坑2 避免注意 空格换行符 image 有些是必须加的
 * */
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'
import ImageModule from 'docxtemplater-image-module-free'
import expressionParser from 'docxtemplater/expressions.js'

/**
 * 将base64格式的数据转为ArrayBuffer
 * @param {Object} dataURL base64格式的数据
 */
function base64Parser(dataURL) {
    const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
    if (!base64Regex.test(dataURL)) {
        return false;
    }
    const stringBase64 = dataURL.replace(base64Regex, "");
    let binaryString;
    if (typeof window !== "undefined") {
        binaryString = window.atob(stringBase64);
    } else {
        binaryString = Buffer.from(stringBase64, "base64").toString("binary");
    }
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}
export const ExportBriefDataDocx = (tempDocxPath, data, fileName, imgSize = {}) => {
    function nullGetter(part, scopeManager) {
        /*
            If the template is {#users}{name}{/} and a value is undefined on the
            name property:
    
            - part.value will be the string "name"
            - scopeManager.scopePath will be ["users"] (for nested loops, you would have multiple values in this array, for example one could have ["companies", "users"])
            - scopeManager.scopePathItem will be equal to the array [2] if
              this happens for the third user in the array.
            - part.module would be empty in this case, but it could be "loop",
              "rawxml", or or any other module name that you use.
        */

        if (!part.module) {
            // part.value contains the content of the tag, eg "name" in our example
            // By returning '{' and part.value and '}', it will actually do no replacement in reality. You could also return the empty string if you prefered.
            return '--';
        }
        if (part.module === "rawxml") {
            return "";
        }
        return "";
    }
    expressionParser.filters.size = function (input, width, height) {
        return {
            data: input,
            size: [width, height],
        };
    };
    // This one sets a max size, allowing to keep the aspect ratio of the image, but ensuring that the width and height do not exceed the limits specified
    expressionParser.filters.maxSize = function (
        input,
        width,
        height
    ) {
        return {
            data: input,
            maxSize: [width, height],
        };
    };

    JSZipUtils.getBinaryContent(tempDocxPath, (error, content) => {
        if (error) {
            console.log(error)
        }
        let imageOptions = {
            //图像是否居中
            centered: true,
            getImage(url, b, c) {
                //将base64的数据转为ArrayBuffer
                return base64Parser(url);
                // return new Promise(function (resolve, reject) {
                //     PizZipUtils.getBinaryContent(
                //         url,
                //         function (error, content) {
                //             if (error) {
                //                 return reject(error);
                //             }
                //             return resolve(content);
                //         }
                //     );
                // });
            },
            // free 版本不生效 付费的docxtemplater-html-module 支持 img异步获取尺寸
            // getSize(img, url, tagName) {
            //     return new Promise(function (resolve, reject) {
            //         const image = new Image();
            //         image.src = url;
            //         image.onload = function () {
            //             resolve([image.width, image.height]);
            //         };
            //         image.onerror = function (e) {
            //             console.log(
            //                 "img, url, tagName : ",
            //                 img,
            //                 url,
            //                 tagName
            //             );
            //             alert(
            //                 "An error occured while loading " +
            //                 url
            //             );
            //             reject(e);
            //         };
            //     });
            // },
            // 单张图片可采用这种方案
            getSize(data, tagName, c) {
                if (imgSize.hasOwnProperty(tagName)) {
                    return imgSize[tagName];
                } else {
                    return [200, 200];
                }
            },
            // getProps(img, tagValue, tagName) {
            //     console.log("getProps", {
            //         img: img.length,
            //         tagValue,
            //         tagName,
            //     });
            //     /*
            //      * If you don't want to change the props
            //      * for a given tagValue, you should write :
            //      *
            //      * return null;
            //      */
            //     return {
            //         caption: {
            //             text: "My custom caption",
            //         },
            //     };
            // },
        }
        // 创建一个JSZip实例，内容为模板的内容        
        const zip = new PizZip(content)
        // 创建并加载 Docxtemplater 实例对象
        let doc = new Docxtemplater(zip, {
            modules: [new ImageModule(imageOptions)],
            nullGetter,
            parser: expressionParser
        });

        try {
            doc.render(data)
        } catch (error) {
            const e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties
            }
            console.log('err', { error: e })
            throw error
        }

        const output = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        saveAs(output, fileName)
    })
}
/**
 * 将图片的url路径转为base64路径
 * 可以用await等待Promise的异步返回
 * @param {Object} imgUrl 图片路径
 */
export function getBase64Sync(imgUrl) {
    return new Promise(function (resolve, reject) {
        let image = new Image();
        image.src = imgUrl;
        image.setAttribute("crossOrigin", '*');
        image.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            let ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
            let quality = 0.8;
            let dataurl = canvas.toDataURL("image/" + ext, quality);
            resolve(dataurl);
        };
        image.error = function (e) {
            console.log(e);
            reject(e.message)
        }
    })
}
/**
 * @description
 * @export
 * @param {imgUrl|base64} base64
 * @return {[width, height]} 
 */
// const A4DimensionalStandards = { width: 842, height: 1156, aspectRatio: 842 / 1156} // A4 纸张尺寸 px
const A4DimensionalStandards = { width: 421, height: 528, aspectRatio: 421 / 528 }
export function getImageSize(base64) {

    return new Promise((resolve, reject) => {
        let img = new Image();
        try {
            img.src = base64
            img.onload = function () {
                let width
                let height
                // 设置A4标准 按比例缩放尺寸
                let aspectRatio = this.width / this.height;
                // console.log([this.width, this.height]);
                if (this.width > A4DimensionalStandards.width) {
                    if (this.height > A4DimensionalStandards.height) {
                        width = A4DimensionalStandards.width
                        height = width / aspectRatio
                        // console.log('2',[width, height]);
                    } else {
                        height = A4DimensionalStandards.height
                        width = height * aspectRatio
                        // console.log('3', [width, height]);
                    }
                } else {
                    if (this.height > A4DimensionalStandards.height) {
                        width = A4DimensionalStandards.width
                        height = width / aspectRatio
                        // console.log('4', [width, height]);
                    } else {
                        height = this.height
                        width = this.width
                        // console.log('5', [width, height]);
                    }
                }
                resolve([width, height])
            }
            img.onerror = function (error) {
                reject(error)
            }

        } catch (error) {
            reject(error)
        }
    })
}