import './scss/main.scss';
import logo from './assets/logo.png';

import axios from 'axios';

document.querySelector('#app').innerHTML = /*html*/`
<div class="container">
    <header class="py-4 text-lg-start text-center">
        <h1><a href="index.html"><img src=${logo} alt="農產品比價網"></a></h1>
    </header>
    <main class="bg-white shadow-yellow border-4 rounded-1 p-md-5 p-3">
        <section class="d-flex justify-content-center gap-1">
            <button
                type="button" id="vegetables"
                class="btn-filter flex-lg-grow-0 flex-grow-1">蔬果</button>
            <button
                type="button" id="fruits"
                class="btn-filter flex-lg-grow-0 flex-grow-1">水果</button>
            <button
                type="button" id="flowers"
                class="btn-filter flex-lg-grow-0 flex-grow-1">花卉</button>
        </section>
        <section class="search-bar row justify-content-center gx-1 pt-md-3 pt-2 pb-md-5 pb-3">
            <div class="col-lg-5 col-md-10 col-12">
                <div class="input-group">
                  <label
                      for="search"
                      class="input-group-text bg-green px-3 border-green">作物名稱</label>
                  <input
                      id="search"
                      type="text"
                      placeholder="請輸入作物名稱"
                      class="form-control border-green">
                </div>
            </div>
            <div class="col-lg-2 col-md-2 col-12">
                <button
                    type="button" id="submit"
                    class="btn-search h-100 px-lg-5 px-md-4 mt-md-0 mt-2">搜尋</button>
            </div>
        </section>
        <section class="dropdown d-flex justify-content-between mb-3">
            <p id="result" class="align-self-md-end align-self-center fs-5 m-0"></p>
            <button
                type="button"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                class="btn btn-sort dropdown-toggle">
                <span id="sort-text" class="pe-5">排序篩選</span>
            </button>
            <ul id="sort" class="dropdown-menu">
                <li><a class="dropdown-item" href="#">依上價排序</a></li>
                <li><a class="dropdown-item" href="#">依中價排序</a></li>
                <li><a class="dropdown-item" href="#">依下價排序</a></li>
                <li><a class="dropdown-item" href="#">依平均價排序</a></li>
                <li><a class="dropdown-item" href="#">依交易量排序</a></li>
            </ul>
        </section>
        <section class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="border-black border-top">
                    <tr class="table-beige align-middle">
                        <th scope="col" width="25%">作物名稱</th>
                        <th scope="col" width="15%">市場</th>
                        <th scope="col" class="text-end" width="12%">上價</th>
                        <th scope="col" class="text-end" width="12%">中價</th>
                        <th scope="col" class="text-end" width="12%">下價</th>
                        <th scope="col" class="text-end" width="12%">平均價</th>
                        <th scope="col" class="text-end" width="12%">交易量</th>
                    </tr>
                </thead>
                <tbody id="dataContent"></tbody>
            </table>
        </section>
        <div id="message" class="text-center pt-3">請輸入並搜尋想比價的作物名稱 ^_^</div>
    </main>
    <footer class="py-4 text-end">
    使用字體：芫荽（<a href="https://github.com/ButTaiwan/iansui" target="_blank">官方文件</a>）
    </footer>
</div>
`

const url = 'https://hexschool.github.io/js-filter-data/data.json'

const search = document.querySelector('#search');
const submit = document.querySelector('#submit');
const result = document.querySelector('#result');
const dataContent = document.querySelector('#dataContent');
const message = document.querySelector('#message');

let keyword = '';

let data = [];

// 渲染資料

function renderData(data) {

  let content = '';

  for (let i=0; i<data.length; i++) {

    content += /* html */`
    <tr>
        <td scope="row" class="fw-bold">${data[i].作物名稱}</td>
        <td scope="row" class="fw-bold">${data[i].市場名稱}</td>
        <td scope="row" class="text-end">${data[i].上價}</td>
        <td scope="row" class="text-end">${data[i].中價}</td>
        <td scope="row" class="text-end">${data[i].下價}</td>
        <td scope="row" class="text-end">${data[i].平均價}</td>
        <td scope="row" class="text-end">${data[i].交易量}</td>
    </tr>
    `

  }

  dataContent.innerHTML = content;
  message.innerHTML = `<a href="#">回到最上面</a>`;

}

// 清空資料

function clearData() {

  data = [];
  renderData(data);
  message.textContent = '查詢不到當日的交易資訊 QQ';
  search.value = '';

}

search.addEventListener('change', (e) => {
  
  keyword = e.target.value;

})

submit.addEventListener('click', () => {
  
  search.value && searchData();

})

// 農產分類篩選

const vegetables = document.querySelector('#vegetables');
const flowers = document.querySelector('#flowers');
const fruits = document.querySelector('#fruits');

vegetables.addEventListener('click', filterData);
flowers.addEventListener('click', filterData);
fruits.addEventListener('click', filterData);

function filterData(e) {

  const { textContent } = e.target;

  const filter = {
    蔬果: 'N04',
    水果: 'N05',
    花卉: 'N06'
  };

  axios.get(url)
  .then((res) => {

    search.value = '';
    result.textContent = '';
    data = res.data.filter((item) => item.種類代碼 === filter[textContent]);
    renderData(data);

  })
  .catch((error) => { console.log(error); })

}

// 字串搜尋篩選

function searchData() {

  result.textContent = `搜尋：${keyword}`;
  search.value = '';

  axios.get(url)
  .then((res) => {
    // console.log(res);
    data = res.data.filter((i) => i.作物名稱 !== null && i.作物名稱.indexOf(keyword) !== -1);
    // console.log(data);
    data.length !== 0 ? renderData(data) : clearData();
  })
  .catch((error) => { console.log(error); })

}

// 數據排序篩選

const sort = document.querySelector('#sort');
const sortText = document.querySelector('#sort-text');

sort.addEventListener('click', sortData);

function sortData(e) {

  e.preventDefault();

  if (data.length) {

    const { textContent } = e.target;

    const sort = {

      '依上價排序': '上價',
      '依中價排序': '中價',
      '依下價排序': '下價',
      '依平均價排序': '平均價',
      '依交易量排序': '交易量',

    }

    // if (sort[textContent] == '上價') { data.sort((a,b) => b.上價 - a.上價) }
    // else if (sort[textContent] == '中價') { data.sort((a,b) => b.中價 - a.中價) }
    // else if (sort[textContent] == '下價') { data.sort((a,b) => b.下價 - a.下價) }
    // else if (sort[textContent] == '平均價') { data.sort((a,b) => b.平均價 - a.平均價) }
    // else if (sort[textContent] == '交易量') { data.sort((a,b) => b.交易量 - a.交易量) }

    // 參考了同學 Moreene 的程式碼，將上面的流程判斷進行修改如下，謝謝同學提供的靈感～！

    data.sort((a, b) => b[sort[textContent]] - a[sort[textContent]]);
    sortText.textContent = textContent;
    renderData(data);

  }

}
