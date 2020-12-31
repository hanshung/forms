const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycbwv6zhZjgzc2chXUhR7K0rpr7H5Pb3EOoSquv_E_rzF6jz1LyA/exec',

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSesKEz45tiaN_sy0n5QHWLeTM1eI_IF8nuuEIR66ON0JIEG_w/formResponse',
    
    // Google Form 各個 input 的 name
    input: {
      id: 'entry.235125850',
      name: 'entry.373777876',
      pickup: 'entry.2088074152',
      addr: 'entry.263741919',
      amount: 'entry.792924016',
      acc: 'entry.1594533079'
    },

    // loading 效果要不要顯示
    loading: false
  },
  methods: {
    // ID 限填 10 碼
    limitIdLen(val) {
      if(val.length = 10) {
        return this.id =  this.id.slice(0, 4);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params = `${this.input.id}=${this.person.id}&${this.input.name}=${this.person.name}&${this.input.pickup}=${this.person.pickup}&${this.input.addr}=${this.person.addr}&${this.input.amount}=${this.person.amount}&${this.input.msg}=${this.person.msg}`;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.id = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // ID 輸入到 4 碼就查詢資料
      if(val.length === 10) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.id] = res; // 把這次查詢的 id 結果存下來
              this.person = res;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
        }

      }
    }
  }
})
