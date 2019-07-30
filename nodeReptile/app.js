const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const Excel = require('exceljs')

const reptileUrl = 'https://www.linefriends.cn'
let index = 1
let count = 0
let data = []

function getIndex(url, i) {
  console.log('正在获取第' + i + '页的数据')
  superagent.get(url + '/SubCategory?pageindex=' + i).end(function(err, res) {
    if (err) {
      throw Error(err)
    }

    let $ = cheerio.load(res.text)
    if ($('.category_pro_list li').html() !== null) {
      $('.category_pro_list li').each(function(i, elem) {
        let that = $(elem)
        let link = 'https://www.linefriends.cn' + that.find(
          '.category_pro_pic a').attr('href')
        let name = that.find('.category_pro_name a').text()
        data.push({
          link,
          name,
          sku: null
        })
      })
      getIndex(url, ++index)
    } else {
      console.log(data)
      console.log('首页抓取完毕')
      console.log('开始抓取详情页')
      getArticl(data, count)
    }
  })
}

function getArticl(urls, n) {
  console.log("正在获取第" + n + "个url的内容", '还有' + urls.length - n + '条')
  superagent.get(urls[n].link).end(function(err, res) {
    if (err) {
      throw Error(err)
    }

    let $ = cheerio.load(res.text)
    let sku = $('#productDetails_sku').html()
    data[n].sku = sku
    if (n < urls.length - 1) {
      getArticl(urls, ++count)
    } else {
      console.log('详情页抓取完毕')
      console.log(data)
      console.log('开始写入')
      fs.writeFile(__dirname + '/data/article.json', JSON.stringify({
        data
      }), function(err) {
        if (err) throw err;
        console.log('写入成功')
        console.log('转换成电子表')
        ExcelSave()
      })
    }
  })
}

function main() {
  console.log('开始爬取')
  getIndex(reptileUrl, index)
}

main()

function ExcelSave() {
  var start_time = new Date();
  var workbook = new Excel.stream.xlsx.WorkbookWriter({
    filename: './data/wendan.xlsx'
  });
  var worksheet = workbook.addWorksheet('Sheet');

  worksheet.columns = [{
      header: '链接',
      key: 'link'
    },
    {
      header: '产品名称',
      key: 'name'
    },
    {
      header: 'sku',
      key: 'sku'
    }
  ];

  var length = data.data.length;

  // 当前进度
  var current_num = 0;
  var time_monit = 400;
  var temp_time = Date.now();

  console.log('开始添加数据');
  // 开始添加数据
  for (let i in data.data) {
    worksheet.addRow(data.data[i]).commit();
    current_num = i;
    if (Date.now() - temp_time > time_monit) {
      temp_time = Date.now();
      console.log((current_num / length * 100).toFixed(2) + '%');
    }
  }
  workbook.commit();

  var end_time = new Date();
  var duration = end_time - start_time;

  console.log('添加数据完毕,用时：' + duration + 'ms');
  console.log("程序执行完毕");
}