let express = require('express');
let moment = require('moment');
let router = express.Router();
let {
  UserModel
} = require('../model');
let jwt = require('jsonwebtoken');
let config = require('../config');
let checkLogin = require('../checkLogin');
let checkPermission = require('../checkPermission');
const visitData = [];
const beginDay = new Date().getTime();
const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const searchData = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}
const salesTypeData = [
  {
    x: '家用电器',
    y: 4544,
  },
  {
    x: '食用酒水',
    y: 3321,
  },
  {
    x: '个护健康',
    y: 3113,
  },
  {
    x: '服饰箱包',
    y: 2341,
  },
  {
    x: '母婴产品',
    y: 1231,
  },
  {
    x: '其他',
    y: 1231,
  },
];

const salesTypeDataOnline = [
  {
    x: '家用电器',
    y: 244,
  },
  {
    x: '食用酒水',
    y: 321,
  },
  {
    x: '个护健康',
    y: 311,
  },
  {
    x: '服饰箱包',
    y: 41,
  },
  {
    x: '母婴产品',
    y: 121,
  },
  {
    x: '其他',
    y: 111,
  },
];

const salesTypeDataOffline = [
  {
    x: '家用电器',
    y: 99,
  },
  {
    x: '食用酒水',
    y: 188,
  },
  {
    x: '个护健康',
    y: 344,
  },
  {
    x: '服饰箱包',
    y: 255,
  },
  {
    x: '其他',
    y: 65,
  },
];

const offlineData = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  const date = moment(new Date().getTime() + 1000 * 60 * 30 * i).format('HH:mm');
  offlineChartData.push({
    date,
    type: '客流量',
    value: Math.floor(Math.random() * 100) + 10,
  });
  offlineChartData.push({
    date,
    type: '支付笔数',
    value: Math.floor(Math.random() * 100) + 10,
  });
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

const radarData = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach((item) => {
  Object.keys(item).forEach((key) => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});


router.get('/notices', async (req, res) => {
  let authorization = req.headers['authorization'];
  if (authorization) {
    try {
      res.send({
        data: [{
            id: '000000001',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
            title: '你收到了 14 份新周报',
            datetime: '2017-08-09',
            type: 'notification',
          },
          {
            id: '000000002',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
            title: '你推荐的 曲妮妮 已通过第三轮面试',
            datetime: '2017-08-08',
            type: 'notification',
          },
          {
            id: '000000003',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
            title: '这种模板可以区分多种通知类型',
            datetime: '2017-08-07',
            read: true,
            type: 'notification',
          },
          {
            id: '000000004',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
            title: '左侧图标用于区分不同的类型',
            datetime: '2017-08-07',
            type: 'notification',
          },
          {
            id: '000000005',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
            title: '内容不要超过两行字，超出时自动截断',
            datetime: '2017-08-07',
            type: 'notification',
          },
          {
            id: '000000006',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
            title: '曲丽丽 评论了你',
            description: '描述信息描述信息描述信息',
            datetime: '2017-08-07',
            type: 'message',
            clickClose: true,
          },
          {
            id: '000000007',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
            title: '朱偏右 回复了你',
            description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
            datetime: '2017-08-07',
            type: 'message',
            clickClose: true,
          },
          {
            id: '000000008',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
            title: '标题',
            description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
            datetime: '2017-08-07',
            type: 'message',
            clickClose: true,
          },
          {
            id: '000000009',
            title: '任务名称',
            description: '任务需要在 2017-01-12 20:00 前启动',
            extra: '未开始',
            status: 'todo',
            type: 'event',
          },
          {
            id: '000000010',
            title: '第三方紧急代码变更',
            description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
            extra: '马上到期',
            status: 'urgent',
            type: 'event',
          },
          {
            id: '000000011',
            title: '信息安全考试',
            description: '指派竹尔于 2017-01-09 前完成更新并发布',
            extra: '已耗时 8 天',
            status: 'doing',
            type: 'event',
          },
          {
            id: '000000012',
            title: 'ABCD 版本发布',
            description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
            extra: '进行中',
            status: 'processing',
            type: 'event',
          },
        ],
        success: true
      });
    } catch (err) {
      res.status(401).send({});
    }
  } else {
    res.status(401).send({});
  }
});

router.get('/fake_analysis_chart_data', async (req, res) => {
  res.send({
    data: {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
      radarData,
    },
    success: true
  });
});

router.get('/project/notice', async (req, res) => {
  res.send({
    data: [
      {
        id: 'xxx1',
        title: titles[0],
        logo: avatars[0],
        description: '那是一种内在的东西，他们到达不了，也无法触及的',
        updatedAt: new Date(),
        member: '科学搬砖组',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx2',
        title: titles[1],
        logo: avatars[1],
        description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
        updatedAt: new Date('2017-07-24'),
        member: '全组都是吴彦祖',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx3',
        title: titles[2],
        logo: avatars[2],
        description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        updatedAt: new Date(),
        member: '中二少女团',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx4',
        title: titles[3],
        logo: avatars[3],
        description: '那时候我只会想自己想要什么，从不想自己拥有什么',
        updatedAt: new Date('2017-07-23'),
        member: '程序员日常',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx5',
        title: titles[4],
        logo: avatars[4],
        description: '凛冬将至',
        updatedAt: new Date('2017-07-23'),
        member: '高逼格设计天团',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx6',
        title: titles[5],
        logo: avatars[5],
        description: '生命就像一盒巧克力，结果往往出人意料',
        updatedAt: new Date('2017-07-23'),
        member: '骗你来学计算机',
        href: '',
        memberLink: '',
      },
    ],
    success: true
  });
});

router.get('/activities', async (req, res) => {
  res.send({
    data: [
      {
        id: 'trend-1',
        updatedAt: new Date(),
        user: {
          name: '曲丽丽',
          avatar: avatars2[0],
        },
        group: {
          name: '高逼格设计天团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-2',
        updatedAt: new Date(),
        user: {
          name: '付小小',
          avatar: avatars2[1],
        },
        group: {
          name: '高逼格设计天团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-3',
        updatedAt: new Date(),
        user: {
          name: '林东东',
          avatar: avatars2[2],
        },
        group: {
          name: '中二少女团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-4',
        updatedAt: new Date(),
        user: {
          name: '周星星',
          avatar: avatars2[4],
        },
        project: {
          name: '5 月日常迭代',
          link: 'http://github.com/',
        },
        template: '将 @{project} 更新至已发布状态',
      },
      {
        id: 'trend-5',
        updatedAt: new Date(),
        user: {
          name: '朱偏右',
          avatar: avatars2[3],
        },
        project: {
          name: '工程效能',
          link: 'http://github.com/',
        },
        comment: {
          name: '留言',
          link: 'http://github.com/',
        },
        template: '在 @{project} 发布了 @{comment}',
      },
      {
        id: 'trend-6',
        updatedAt: new Date(),
        user: {
          name: '乐哥',
          avatar: avatars2[5],
        },
        group: {
          name: '程序员日常',
          link: 'http://github.com/',
        },
        project: {
          name: '品牌迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
    ],
    success: true
  });
});

router.get('/fake_workplace_chart_data', async (req, res) => {
  res.send({
    data: [
      {
        id: 'trend-1',
        updatedAt: new Date(),
        user: {
          name: '曲丽丽',
          avatar: avatars2[0],
        },
        group: {
          name: '高逼格设计天团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-2',
        updatedAt: new Date(),
        user: {
          name: '付小小',
          avatar: avatars2[1],
        },
        group: {
          name: '高逼格设计天团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-3',
        updatedAt: new Date(),
        user: {
          name: '林东东',
          avatar: avatars2[2],
        },
        group: {
          name: '中二少女团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-4',
        updatedAt: new Date(),
        user: {
          name: '周星星',
          avatar: avatars2[4],
        },
        project: {
          name: '5 月日常迭代',
          link: 'http://github.com/',
        },
        template: '将 @{project} 更新至已发布状态',
      },
      {
        id: 'trend-5',
        updatedAt: new Date(),
        user: {
          name: '朱偏右',
          avatar: avatars2[3],
        },
        project: {
          name: '工程效能',
          link: 'http://github.com/',
        },
        comment: {
          name: '留言',
          link: 'http://github.com/',
        },
        template: '在 @{project} 发布了 @{comment}',
      },
      {
        id: 'trend-6',
        updatedAt: new Date(),
        user: {
          name: '乐哥',
          avatar: avatars2[5],
        },
        group: {
          name: '程序员日常',
          link: 'http://github.com/',
        },
        project: {
          name: '品牌迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
    ],
    success: true
  });
});

router.get('/currentUser', async (req, res) => {
  res.send({
    data: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        {
          key: '0',
          label: '很有想法的',
        },
        {
          key: '1',
          label: '专注设计',
        },
        {
          key: '2',
          label: '辣~',
        },
        {
          key: '3',
          label: '大长腿',
        },
        {
          key: '4',
          label: '川妹子',
        },
        {
          key: '5',
          label: '海纳百川',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      geographic: {
        province: {
          label: '浙江省',
          key: '330000',
        },
        city: {
          label: '杭州市',
          key: '330100',
        },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    },
    success: true
  });
});

// router.get('/fake_list', async (req, res) => {
//   res.send({
//     data: {
//       visitData,
//       visitData2,
//       salesData,
//       searchData,
//       offlineData,
//       offlineChartData,
//       salesTypeData,
//       salesTypeDataOnline,
//       salesTypeDataOffline,
//       radarData,
//     },
//     success: true
//   });
// });

module.exports = router;