<!--
 * @Author: yhx 2045399856@qq.com
 * @Date: 2024-05-23 09:05:27
 * @LastEditTime: 2024-05-25 21:37:51
 * @FilePath: \vue-template-export-word\src\views\HomeView.vue
 * @Description: 
 * 
-->
<script setup>
import { ExportBriefDataDocx, getBase64Sync } from '@/utils/templaterWord.js'
import imageDefault from "@/assets/image.png"
const listname = 'output'

let data = {
  county: '西青区',
  township: "杨柳青镇",
  image1: null,
  // image2: null,
  des: `我的世界 变得奇妙更难以言喻,还以为 是从天而降的梦境,直到确定 手的温度来自你心里,这一刻 我终于勇敢说爱你,一开始 我只顾着看你,装做不经意 心却飘过去
,还窃喜 你 没 发现我 躲在角落,忙着快乐 忙着感动,从彼此陌生到熟 会是我们从没想过,真爱 到现在 不敢期待,要证明自己 曾被你想起 Really？我胡思乱想 就从今天起 I wish
,像一个陷阱 却从未犹豫 相信,你真的愿意 就请给我惊喜,关于爱情 过去没有异想的结局,那天起 却颠覆了自己逻辑,我的怀疑 所有答案因你而明白,转啊转 就真的遇见 Mr.right,一开始 我只顾着看你,装做不经意 心却飘过去,还窃喜 你 没 发现我 躲在角落,忙着快乐 忙着感动,从彼此陌生到熟 会是我们从没想过,真爱 到现在 不敢期待,要证明自己 曾被你想起 Really？,            我胡思乱想 就从今天起 I wish,像一个陷阱 却从未犹豫 相信,你真的愿意 就请给我惊喜,关于爱情 过去没有异想的结局,那天起 却颠覆了自己逻辑,我的怀疑 所有答案因你而明白,转啊转 就真的遇见 Mr.right,我的世界 变得奇妙更难以言喻,还以为 是从天而降的梦境,直到确定 手的温度来自你心里,这一刻 也终于勇敢说爱你`,
  data: [
    {
      id: "1",
      dw: "点位1",
      tmd: "透明度1",
      rjy: "溶解氧1",
      ad: "氨氮1",
    },
    {
      id: "2",
      dw: "点位2",
      tmd: "透明度2",
      rjy: "溶解氧2",
      ad: "氨氮2",
    },
    {
      id: "3",
      dw: "点位3",
      tmd: "透明度3",
      rjy: "溶解氧3",
      ad: "氨氮4",
    },
  ]
}

let imgurl1 = "http://yhx-yhx.github.io/noteplus-dist/logog.svg"

const exportWordFile = async () => {
  console.log('exportWordFile');
  data.image1 = await getBase64Sync(imgurl1)
  ExportBriefDataDocx(import.meta.env.VITE_APP_BASE_API + "/template/testTemplater.docx", data, `${listname}.docx`);
}

</script>

<template>
  <div style="width: 100%; height: 100%; padding: 20px;">
    <div style="display: flex; flex: 1; height: 100%;border:1px solid #825825;border-radius: 5px;">
      <div class="image-default " style="flex: 1;height: 100%;">
        <img style="width:100%;height: 100%;border-right:1px solid #825825;padding: 5px;" :src="imageDefault"
          fit="fill" />
      </div>
      <div class="export-function " style="flex: 1;padding: 20px">
        <h2 style="display: flex;justify-content: center ;line-height: 1.8;padding:10px 0 ;">
          <a style="text-decoration: none;color:#825825;font-size: 1.4em;font-weight: 600;"
            href="https://github.com/open-xml-templating/docxtemplater" target="_blank">docxtemplater</a>
        </h2>
        <ul>
          <li>word模板中模板字符串 中间不要携带空格 无法正常编译过</li>
          <li> Note that it is however not possible to use no delimiters at all, docxtemplater forces you to have some
            delimiters.
            <p> 请注意，但是根本不可能使用任何分隔符，docxtemplater 强制您使用一些分隔符。</p>
          </li>
        </ul>
        <button
          style="padding: 8px 16px;border-radius: 6px;background-color: white;border: 2px solid #ccc; color:#825825;cursor: pointer;"
          @click="exportWordFile">exportWordFile</button>
      </div>
    </div>



  </div>
</template>
