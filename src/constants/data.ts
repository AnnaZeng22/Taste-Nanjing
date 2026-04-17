export interface Dish {
  id: string;
  name: string;
  chineseName: string;
  category: "Heritage" | "Classic" | "Halal" | "Vegan" | "Street Food";
  description: string;
  culturalContext: string;
  ingredients: string[];
  dietaryFlags: {
    halal: boolean;
    vegan: boolean;
    noPork: boolean;
    spiceLevel: 0 | 1 | 2 | 3;
  };
  image: string;
}

export const REAL_DISHES: Dish[] = [
  {
    id: "roast-duck",
    name: "Nanjing Roast Duck",
    chineseName: "南京烤鸭",
    category: "Heritage",
    description: "Nanjing Roast Duck, a traditional dish of Nanjing and part of the Jinling cuisine, also known as Jinling Roast Duck, is celebrated for its crispy skin and tender meat, rich in flavor yet not greasy as found in other regions.",
    culturalContext: "Nanjing's roast duck predates the Beijing style and is the ancestor of the famous Peking Duck.",
    ingredients: ["Lake duck", "Maltose Sugar", "Spices"],
    dietaryFlags: { halal: false, vegan: false, noPork: true, spiceLevel: 0 },
    image: "https://th.bing.com/th/id/R.2ef8674fd70ee86f6773ae74061f10df?rik=pNnr7lTdeXMQ3Q&riu=http%3a%2f%2fstatic.jstv.com%2fimg%2f2021%2f2%2f4%2f2021241612433673385_185.png&ehk=5d4cMmWGOpGKkJxQckXW%2bwKRbeU4cdc1nV1QsDjz66k%3d&risl=&pid=ImgRaw&r=0"
  },
  {
    id: "chicken-broth-buns",
    name: "Chicken Broth Buns",
    chineseName: "鸡汁汤包",
    category: "Street Food",
    description: "Chicken Broth Buns are a gem among Nanjing’s snacks. Their main allure is the thin skin and generous filling, bursting with delicious, fresh broth. Just one bite releases a burst of flavor that encapsulates Nanjing’s ultimate passion and love for culinary arts.",
    culturalContext: "A staple of Nanjing breakfast culture, known for its rich soup inside the bun.",
    ingredients: ["Chicken broth", "Diced chicken", "Flour"],
    dietaryFlags: { halal: false, vegan: false, noPork: false, spiceLevel: 0 },
    image: "https://pic4.40017.cn/poi/2016/08/23/11/4qFY5f_640x320_00.jpg"
  },
  {
    id: "duck-blood-vermicelli",
    name: "Duck Blood and Vermicelli Soup",
    chineseName: "鸭血粉丝汤",
    category: "Street Food",
    description: "Duck Blood and Vermicelli Soup is a traditional Nanjing dish, a prominent representative of Jinling cuisine, and a famous duck-based delicacy nationwide. It is prepared by cooking duck blood, duck intestines, duck liver, and vermicelli in duck broth, resulting in tender duck blood, crispy intestines, soft liver, flavorful broth, and elastic vermicelli.",
    culturalContext: "The ultimate Nanjing comfort food, representative of the city's duck-focused culinary identity.",
    ingredients: ["Duck blood", "Vermicelli", "Duck intestines", "Duck liver", "Duck gizzard"],
    dietaryFlags: { halal: false, vegan: false, noPork: true, spiceLevel: 1 },
    image: "https://pic.nximg.cn/file/20181201/9885883_090835152081_2.jpg"
  },
  {
    id: "beef-potstickers",
    name: "Beef Potstickers",
    chineseName: "牛肉锅贴",
    category: "Halal",
    description: "Beef Potstickers are a popular street snack that resemble dumplings but are pan-fried to a golden, crispy finish, offering a crispy exterior and tender interior. The beef filling is exceptionally savory, making each bite irresistibly juicy.",
    culturalContext: "A specialty of Nanjing's Hui Muslim tradition.",
    ingredients: ["Flour", "Beef"],
    dietaryFlags: { halal: true, vegan: false, noPork: true, spiceLevel: 0 },
    image: "https://th.bing.com/th/id/R.376d760b83fc32afce9cdab23d3a6b82?rik=vZKEyeCUGKNHvQ&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn20110%2f213%2fw2048h1365%2f20190501%2fccb4-hwfpcxn3278253.jpg&ehk=OVjsggNoxdbnUXoO53HOkKCNBeHr0EyDWEJIKrO1298%3d&risl=&pid=ImgRaw&r=0"
  },
  {
    id: "tripe-noodles",
    name: "Tripe Noodles",
    chineseName: "皮肚面",
    category: "Street Food",
    description: "Tripe Noodles are a traditional Nanjing specialty snack, also known as Jinling cuisine or Jinling small noodles. These noodles are known for their rich broth and variety of ingredients, offering a fresh and palatable taste.",
    culturalContext: "A signature noodle dish of Nanjing, often called 'Pidu Mian'.",
    ingredients: ["Tripe", "Pig liver", "Sausage", "Shredded meat"],
    dietaryFlags: { halal: false, vegan: false, noPork: false, spiceLevel: 1 },
    image: "https://tse2.mm.bing.net/th/id/OIP.sJzjmpVAh-XDBnUbIKq_rAHaE5?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: "plum-blossom-cake",
    name: "Plum Blossom Cake",
    chineseName: "梅花糕",
    category: "Street Food",
    description: "As a traditional Nanjing pastry, Plum Blossom Cake charms many with its unique shape and taste. Resembling plum blossoms, it is soft, sweet, and rich in filling. Each bite offers a perfect blend of glutinous rice and filling, leaving one longing for more. This pastry is not only delicious but also an essential part of Nanjing’s festive celebrations.",
    culturalContext: "Named after the plum blossom, Nanjing's city flower.",
    ingredients: ["White flour", "Red bean paste", "Sugar"],
    dietaryFlags: { halal: true, vegan: true, noPork: true, spiceLevel: 0 },
    image: "https://image.maigoo.com/upload/images/20220812/09173135347_640x426.jpg"
  },
  {
    id: "old-marinade-noodles",
    name: "Old Marinade Noodles",
    chineseName: "老卤面",
    category: "Classic",
    description: "Old Marinade Noodles are a staple in the lives of many old Nanjing locals and a dish many expats dream about. The standout feature is the ‘tiger-skin’ pork, which is absolutely sensational with a bite, especially when paired with pickled vegetables and hot oil, creating an unmatched flavor.",
    culturalContext: "Famous for its deep-flavored 'marinade' or 'brine' sauce.",
    ingredients: ["Noodles", "Pork"],
    dietaryFlags: { halal: false, vegan: false, noPork: false, spiceLevel: 0 },
    image: "https://tr-osdcp.qunarzz.com/tr-osd-tr-mapi/img/ad18d1f4b5625d5e12990d8998039af8.jpg"
  },
  {
    id: "rice-cake-balls",
    name: "Rice Cake Balls",
    chineseName: "糕团",
    category: "Street Food",
    description: "Rice Cake Balls are a traditional Nanjing pastry and a classic example of Jinling snacks. Nanjing’s approach to sweets emphasizes that they should be sweet but not cloying, and glutinous but not sticky, truly making them a delicacy. Moreover, the visual appeal and colors are as important as the taste, making these small, colorful, and delicately shaped treats a joy to eat, with their soft, sweet texture and fragrant aroma.",
    culturalContext: "A variety of colorful Jiangnan pastries.",
    ingredients: ["Flour", "Sugar"],
    dietaryFlags: { halal: true, vegan: true, noPork: true, spiceLevel: 0 },
    image: "https://n.sinaimg.cn/fashion/crawl/117/w550h367/20201102/2293-kcieyvz6909019.jpg"
  },
  {
    id: "salted-duck",
    name: "Salted Duck",
    chineseName: "盐水鸭",
    category: "Heritage",
    description: "Salted Duck is a famous specialty of Nanjing, particularly renowned when made during the osmanthus blooming season around Mid-Autumn Festival, which gives rise to its nickname “Osmanthus Duck.” Unlike many traditional cured meats which are typically salted, Nanjing Salted Duck is prepared using a low-temperature cooking method that makes the duck meat tender and juicy. This delicacy is not just a culinary treat but also a symbol of Nanjing’s renowned hospitality.",
    culturalContext: "Nanjing's most iconic dish, reflecting over a millennium of history.",
    ingredients: ["Duck meat"],
    dietaryFlags: { halal: false, vegan: false, noPork: true, spiceLevel: 0 },
    image: "https://pic.nximg.cn/file/20200709/27274084_131236256081_2.jpg"
  },
  {
    id: "red-bean-yuanxiao",
    name: "Red Bean Yuanxiao",
    chineseName: "赤豆元宵",
    category: "Street Food",
    description: "When visiting Nanjing, one must try the Red Bean Yuanxiao. This warm, sweet, and glutinous treat is particularly comforting in the autumn and winter seasons.",
    culturalContext: "A quintessential Nanjing dessert, sweet and silky.",
    ingredients: ["Red beans (Adzuki beans)", "Glutinous rice flour"],
    dietaryFlags: { halal: true, vegan: true, noPork: true, spiceLevel: 0 },
    image: "https://th.bing.com/th/id/R.262894ce9ce98808d6b36e9c1cf06ea8?rik=kJdymDkVkL37Jg&riu=http%3a%2f%2fwww.meishijie.cc%2fd%2ffile%2f2025%2f51d063b8e7e5bd40caa31e0dea576218.jpg&ehk=hWW2tNibz5Uysxayv77eygplk9lKLp11kPyp4y4K4zw%3d&risl=&pid=ImgRaw&r=0"
  },
  {
    id: "meiling-porridge",
    name: "Meiling Porridge",
    chineseName: "美龄粥",
    category: "Heritage",
    description: "Meiling Porridge, one of Nanjing’s traditional dishes, originated during the Republican era and is reputed to have been the favorite of the first lady of the Republic. It’s made from a mix of soy milk, glutinous rice, japonica rice, Chinese yam, lily, goji berries, and rock sugar, offering a light yet nutritious meal.",
    culturalContext: "A dish with strong historical ties to Nanjing's Republican period.",
    ingredients: ["Soy milk", "Glutinous rice", "Japonica rice", "Chinese yam", "Lily", "Goji berries", "Rock sugar"],
    dietaryFlags: { halal: true, vegan: true, noPork: true, spiceLevel: 0 },
    image: "https://p8.itc.cn/images01/20220307/cb3b1d45623a410bafc70f5409d05f3e.jpeg"
  }
];

export const REAL_RESTAURANTS = [
  {
    id: "res-1",
    name: "Xu’s Duck Shop (Laomen East Branch)",
    chineseName: "徐家鸭子 (老门东店)",
    tags: ["Roast Duck", "Local Favorite"],
    address: "No. 49 Santiaoying, Laomen East, Qinhuai District, Nanjing",
    specialty: "Nanjing Roast Duck",
    description: "A famous local duck shop known for its crispy skin and tender meat. (Avg: 28 RMB)",
    image: "https://youimg1.c-ctrip.com/target/10080g0000007vj5k1643.jpg"
  },
  {
    id: "res-2",
    name: "Jiming Steamed Buns (Gongyuan West Street Branch)",
    chineseName: "鸡鸣汤包 (贡院西街店)",
    tags: ["Chicken Broth Buns", "Heritage"],
    address: "No. 17 Gongyuan West Street, Qinhuai District, Nanjing",
    specialty: "Chicken Broth Buns",
    description: "A gem among Nanjing's snacks with thin skin and fresh broth. (Avg: 32 RMB)",
    image: "https://q9.itc.cn/images01/20240122/7e9673728702401a9135eb52e96c354f.jpeg"
  },
  {
    id: "res-3",
    name: "Xiaopanji Duck Blood and Vermicelli Soup",
    chineseName: "小潘记鸭血粉丝汤",
    tags: ["Duck Blood Soup", "Must-Try"],
    address: "No. 198 Zhongshan East Road, Longtai International Mansion beside Starbucks, Qinhuai District, Nanjing",
    specialty: "Duck Blood and Vermicelli Soup",
    description: "A famous representative of Jinling cuisine. (Avg: 31 RMB)",
    image: "https://www.cnpp100.com/uploads/allimg/190326/1-1Z3261105050-L.jpg"
  },
  {
    id: "res-4",
    name: "Liji Islamic Restaurant (Dading Alley Branch)",
    chineseName: "李记清真馆 (大钉巷店)",
    tags: ["Beef Potstickers", "Halal"],
    address: "No. 1 Dading Alley, Pingshi Street, Chaotiangong Residential District, Qinhuai, Nanjing",
    specialty: "Beef Potstickers",
    description: "A popular spot for juicy and crispy beef potstickers. (Avg: 28 RMB)",
    image: "https://dimg04.c-ctrip.com/images/100a0g00000088bclF019_C_560_10000.jpg"
  },
  {
    id: "res-5",
    name: "Yiji Tripe Noodles (Mingwalang Branch)",
    chineseName: "易记皮肚面 (明瓦廊店)",
    tags: ["Tripe Noodles", "Street Food"],
    address: "No. 101 Mingwalang, Qinhuai District, Nanjing",
    specialty: "Tripe Noodles",
    description: "Known for rich broth and legendary tripe noodles in the famous food street. (Avg: 15 RMB)",
    image: "https://th.bing.com/th/id/R.ccaf94fc1af12b8d14e83d549d61cd1e?rik=KtAy%2bLgF3D%2fYQQ&riu=http%3a%2f%2fimg.1637.com%2f2020%2f03%2f09%2fCRF7UU7KEITX738605.jpg&ehk=8oZNqV5INIL%2bG0rI0zKRrenBQ3MVCmAXhyQlL1RfSd0%3d&risl=&pid=ImgRaw&r=0"
  },
  {
    id: "res-6",
    name: "Master Zuo’s Plum Blossom Cake (Xinjiekou Branch)",
    chineseName: "左师傅梅花糕 (新街口店)",
    tags: ["Plum Blossom Cake", "Pastry"],
    address: "No. 2-2 Huaihai Road, Qinhuai District, Nanjing",
    specialty: "Plum Blossom Cake",
    description: "Signature Nanjing pastry with unique shape and taste. (Avg: 10 RMB)",
    image: "https://tr-osdcp.qunarzz.com/tr-osd-tr-space/img/e3587e1185f6e72f071734e535b6945e.jpg"
  },
  {
    id: "res-7",
    name: "Xiaolong Big Meat Noodles",
    chineseName: "小龙大肉面",
    tags: ["Marinade Noodles", "Classic"],
    address: "No. 28 Shuangqiaomen, Qinhuai District, Nanjing",
    specialty: "Old Marinade Noodles",
    description: "Famous for its sensational ‘tiger-skin’ pork and deep flavors. (Avg: 20 RMB)",
    image: "https://n.sinaimg.cn/sinakd20109/533/w1280h853/20200317/de31-iqyryku5220203.jpg"
  },
  {
    id: "res-8",
    name: "Aunt Xu’s Rice Cake Balls Shop (Changbai Street Branch)",
    chineseName: "许阿姨糕团店 (长白街店)",
    tags: ["Rice Cake Balls", "Classic"],
    address: "No. 1 Puhua Alley, Qinhuai District, Nanjing",
    specialty: "Rice Cake Balls",
    description: "A joy to eat, with small, colorful, and delicately shaped treats. (Avg: 23 RMB)",
    image: "https://www.918canyin.com/uploads/202008/18/182735781.jpg"
  },
  {
    id: "res-9",
    name: "Xu’s Duck Shop (Qinhhong South Road Branch)",
    chineseName: "徐家鸭子 (秦虹南路店)",
    tags: ["Salted Duck", "Heritage"],
    address: "No. 34 Qinhong South Road, Qinhuai District, Nanjing",
    specialty: "Salted Duck",
    description: "Famous for tender and juicy Salted Duck, a symbol of Nanjing's hospitality. (Avg: 30 RMB)",
    image: "https://tse1.mm.bing.net/th/id/OIP.VipRwxIlpaxVuQgVGUsjyQAAAA?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: "res-10",
    name: "Liu Changxing (Gulou Branch)",
    chineseName: "刘长兴 (鼓楼店)",
    tags: ["Red Bean Yuanxiao", "Comfort Food"],
    address: "No. 6 Gaoloumen, Xuanwu District, Nanjing",
    specialty: "Red Bean Yuanxiao",
    description: "A warm and sweet glutinous treat, perfect for autumn and winter. (Avg: 28 RMB)",
    image: "https://tse3.mm.bing.net/th/id/OIP.kosXUBJPSX1oas6WeWMlewHaFj?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: "res-11",
    name: "Nanjing Food Stall (Confucius Temple Pingjiangfu Branch)",
    chineseName: "南京大牌档 (夫子庙平江府路店)",
    tags: ["Meiling Porridge", "Republican Era"],
    address: "No. 48 Dashiba Street, Qinhuai District, Nanjing",
    specialty: "Meiling Porridge",
    description: "Authentic Republican era atmosphere serving the famous Meiling Porridge. (Avg: 73 RMB)",
    image: "https://tr-osdcp.qunarzz.com/tr-osd-tr-manager/img/3e2aaf839ed93211b7ec908c37ee7860.jpg"
  }
];
