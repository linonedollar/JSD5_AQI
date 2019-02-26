var app = new Vue({
  el: '#app',
  data: {
    allData: [],
    selectCountry: '',
    isLoading: false,
    updateTime: '',
    Detail: {}
  },
  methods: {
    getData(){
      const vm = this;
      const apiUrl = 'https://script.google.com/macros/s/AKfycbwXCxXw9Fy0Wu7LRm0wr2jraUgqdr6tm6SyqYBvNc69If_RtWs0/exec?url=http://opendata.epa.gov.tw/webapi/Data/REWIQA/?format=json';
      vm.isLoading = true;
      axios({
        method:'get',
        url:apiUrl,
      })
      .then(function (response) {
        vm.allData = response.data;
        vm.updateTime = vm.getTime();
        vm.Detail = vm.initDetail();
        vm.isLoading = false;
      })
      .catch(function (error) {
        vm.updateTime = vm.getTime();
        vm.isLoading = false;
        console.log('取得資料失敗:' + error);
      });
    },
    getTime(){
      const now = new Date();
      let month = now.getMonth() + 1;
      if(month < 10){ month = `0${month}` }
      let timeStr = `${now.getFullYear()}-${month}-${now.getDate()} 
      ${now.getHours()}:${now.getMinutes()}`;
      return timeStr;
    },
    initDetail(country = '高雄市'){
      const vm = this;
      return vm.allData.find((item) =>{
        return item.County === country;
      });
    },
    showDetail(item){
      const vm = this;
      vm.Detail = item;
    },
    statusColor(status) {
      let className = '';
      switch (status) {
        case '良好':
          return className = 'great'
          break;
        case '普通':
          return className = 'normal'
          break;
        case '對敏感族群不健康':
          return className = 'ok'
          break;
        case '對所有族群不健康':
          return className = 'notGood'
          break;
        case '非常不健康':
          return className = 'myGod'
          break;
        case '危害':
          return className = 'danger'
          break;
        default:
          return className
          break;
      }
    }
  },
  computed: {
    filterCountryArray(){
      const vm = this;
      let countyArray = [];
      for (let i = 0; i < vm.allData.length; i++) {
        countyArray[i] = vm.allData[i].County;
      }
      return countyArray.filter((element, index, arr) => {
        return arr.indexOf(element) === index;
      });
    },
    filterCountryData(){
      const vm = this;
      if(!vm.selectCountry){    
        return vm.allData.filter((item) => {
          return item.County === '高雄市';
        });
      } else {
        vm.Detail = vm.initDetail(vm.selectCountry);
        return vm.allData.filter((item) => {
          return item.County === vm.selectCountry;
        });
      }
    }
  },
  created() {
    this.getData();
  },
})