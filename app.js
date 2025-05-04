//后端地址
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

//获取城市列表
const fetchCities = async() => {
  try{
    showLoading();
    const res = await axios.get(`${API_BASE}?q=${cityName}&appid=859d8fbe0a8627c8011bad2532c6a317`);
    renderCityList(res.data);
  }
  catch(error){
    alert('获取城市列表失败：' + (error.resonse?.data?.message || '网络错误'));
  }
  finally{
    hideLoading();
  }
};

//添加城市（调用后端接口）
const addCity = async(cityName) => {
  try{
    showLoading();
    const res = await axios.post(`${API_BASE}?q=${cityName}&appid=859d8fbe0a8627c8011bad2532c6a317`,{name:cityName});
    fetchCities(res.data);
    return res.data;
  }
  catch(error){
    alert('获取城市列表失败：' + (error.resonse?.data?.message || '网络错误'));
    return null;
  }
  finally{
    hideLoading();
  }
};

//删除城市（调用后端接口）
const deleteCity = async(cityId) => {
  try{
    showLoading();
    await axios.delete(`${API_BASE}?q=${cityName}&appid=859d8fbe0a8627c8011bad2532c6a317/${cityId}`);
    fetchCities();
  }
  catch(error){
    alert('删除城市失败' + (error.resonse?.data?.message || '网络错误'));
  }
  finally{
    hideLoading();
  }
};

//渲染城市列表
const renderCityList = (cities) => {
  const cityList = document.getElementById('cityList');
  cityList.innerHTML = '';
  
  if(cities.length === 0){
    cityList.innerHTML = '<li class="empty-tip">当前没有已添加的城市，快来添加吧~</li>';
    return;
  }

  cities.forEach(city => {
    const li = document.createElement('li');
    li.className = 'city-item';
    li.innerHTML = `
      <span class="city-name">${city.name}</span>
      <button class="delete-btn" data-id="${city.id}"}>删除</button>
    `;
    cityList.appendChild(li);
  });
};

//显示加载状态
const showLoading = () => {
  const cityList = document.getElementById('cityList');
  cityList.innerHTML = '<li class="loading">加载中...</li>'
};

//隐藏加载状态
const hideLoading = () => {
  const loading = document.querySelector('.loading');
  if(loading) loading.remove();
};

//初始化事件监听
document.addEventListener('DOMContentLoaded',()=>{
  fetchCities();    //页面加载时获取城市列表

  //添加按钮点击事件
  document.getElementById('addBtn').addEventListener('click',async()=>{
    const input = document.getElementById('cityInput');
    const cityName = input.value.trim();

    if(!cityName){
      alert('请输入有效的城市名称');
      input.focus();
      return;
    }

    await addCity(cityName);
    input.value = '';   //清空输入框

  });


  //输入框回车事件
  document.getElementById('cityInput').addEventListener('keypress',(e)=>{
    if(e.key === 'Enter') document.getElementById('addBtn').click();
  });

  //删除按钮事件委托
  document.getElementById('cityList').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const cityId = e.target.dataset.id;
        deleteCity(cityId);
    }
  });
});