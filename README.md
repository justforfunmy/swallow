# swallows 网页爬取工具

## 目录

- [安装](#安装)
- [使用](#使用)
- [配置选项](#配置选项)
- [demo](#demo)

## 安装

```Shell
yarn add swallows --global
```

## 使用

- init

```Shell
swallows init
```

初始化并生成配置文件`config.json`。`config.json`具体配置见[配置选项](#配置选项)

- crawl

```Shell
swallows crawl
```

默认读取当前运行目录下的`config.json`作为配置，并运行爬虫程序。

或者可以自定义配置文件路径，**以当前运行目录为参照的相对路径**。

```Shell
swallows crawl -src ../config.json
```

- importUrls

从 json 文件导入 url 并写入到`config.json`。

> 注意被导入的 json 文件内容是数组，并且数组内元素是一个包含 url 属性的对象。如:`[{"name":"a","url":"https://www.baidu.com"}]`

## 配置选项

- `name<string>`

名称，爬虫程序完成后会生成以该名称命名的 json 文件存储结果

- `url<string | array>`

爬取网站地址，可以是字符串，表示爬取网站的首个地址，也可以是字符串数组，会按顺序爬取网站

- `actions<array>`

需要在网页上执行的动作，会按照数组的先后顺序执行。配置动作:

```json
{
  "type": "click",
  "selector": "#button"
}
```

`type`表示动作类型，`selector`表示执行动作的元素选择器

- `pagination<object>`

分页选项，包括页数`count`，以及触发下一页的选择器`nextpageSelector`

- `targetSelector<string>`

需要采集数据的目标容器选择器，最好包裹住所有需要采集的内容

- `properties<array>`

需要采集的数据字段及内容,具体配置：

```json
{
  "name": "name",
  "selector": "div.name",
  "source": "innerText"
}
```

`name`：字段名，用于存储数据

`selector`：目标选择器，从`targetSelector`开始查找

`source`：采集内容的来源，可以理解为元素的属性。

## demo

以爬取[imdb]top250 影片信息为例：

1. 初始化

```Shell
swallows init
```

按照命令行提示输入名称"imdb250",然后可以看到生成 imdb250 文件夹，里面包含`config.json`。

2. 配置选项

打开配置文件，并写入配置，如：

```json
{
  "name": "imdb250",
  "url": "https://www.imdb.cn/imdb250/",
  "actions": [
    {
      "type": "",
      "selector": ""
    }
  ],
  "pagination": {
    "count": 0,
    "nextpageSelector": ""
  },
  "targetSelector": "div.ranking_lister > table > tbody > tr",
  "properties": [
    {
      "name": "name",
      "selector": "td.rl_name>a",
      "source": "title"
    },
    {
      "name": "url",
      "selector": "td.rl_name>a",
      "source": "href"
    },
    {
      "name": "rate",
      "selector": "td.rl_grade_IMDB>span",
      "source": "innerText"
    }
  ]
}
```

3. 启动程序

```Shell
swallows crawl
```

完成后会生成`imdb250.json`。
