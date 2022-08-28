Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    isShowCalendar: {
      type: Boolean,
      value: false
    }
  },
  data: {
    calendarHeadWeek: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDayNums: 42, //当前日历每页的总天数
    todayDay: new Date().getDate(),
    todayTimeStamp: new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()).getTime(),
    currentChooseYear: new Date().getFullYear(),
    currentChooseMonth: new Date().getMonth() + 1,
    currentChooseDay: new Date().getDate(),
    lastMonthRestDays: [], //日历每页的上月时间
    currentMonthDayCont: [], //日历每页的当月时间
    nextMonthRestDays: [], //日历每页的下月时间
    chooseDays: [], //选中的日期

    calendarPage: Array(50),
    currentCalendarPage: 25
  },
  methods: {
    // 选择日期
    chooseDate(e) {
      let _type = e.currentTarget.dataset.type;
      let _month = this.data.currentChooseMonth;
      let _date = e.currentTarget.dataset.date;
      _month = _type == 0 ? _month - 1 : (_type == 1 ? _month : _month + 1)

      let _currentTimestamp = this.data.todayTimeStamp
      let _chooseTimestamp = new Date(this.data.currentChooseYear + '-' + _month + '-' + _date).getTime()
      if (_chooseTimestamp < _currentTimestamp) return;

      let _arr0 = this.data.lastMonthRestDays;
      let _arr1 = this.data.currentMonthDayCont;
      let _arr2 = this.data.nextMonthRestDays;

      let _index;
      if (_type == 0) {
        for (let i = 0; i < _arr0.length; i++) {
          if (_arr0[i].Number == _date) {
            _index = i
          }
        }
        _arr0[_index].choose = !_arr0[_index].choose
      } else if (_type == 1) {
        for (let i = 0; i < _arr1.length; i++) {
          if (_arr1[i].Number == _date) {
            _index = i
          }
        }
        _arr1[_index].choose = !_arr1[_index].choose
      } else {
        for (let i = 0; i < _arr2.length; i++) {
          if (_arr2[i].Number == _date) {
            _index = i
          }
        }
        _arr2[_index].choose = !_arr2[_index].choose
      }

      this.setData({
        lastMonthRestDays: _arr0,
        currentMonthDayCont: _arr1,
        nextMonthRestDays: _arr2
      })

    },

    // 确认
    confirmDates() {
      let _arr = [];

      for (let i = 0; i < this.data.currentMonthDayCont.length; i++) {
        if (this.data.currentMonthDayCont[i].choose) {
          _arr.push(this.getFormatDate(this.data.currentChooseYear, this.data.currentChooseMonth, this.data.currentMonthDayCont[i].Number))
        }
      }

      for (let i = 0; i < this.data.nextMonthRestDays.length; i++) {
        if (this.data.nextMonthRestDays[i].choose) {
          _arr.push(this.getFormatDate(this.data.currentChooseYear, this.data.currentChooseMonth + 1, this.data.nextMonthRestDays[i].Number))
        }
      }

      this.setData({
        chooseDays: _arr
      })

      this.triggerEvent('hideCalendar', {
        word: this.data.chooseDays ? this.data.chooseDays : ''
      })

    },

    // 切换日历页面
    changeCalendarPage(e) {
      let _obj = {};
      let _type = e.currentTarget.dataset.type;
      let _arr = this.data.calendarPage
      _obj.prev = this.data.lastMonthRestDays
      _obj.curr = this.data.currentMonthDayCont
      _obj.next = this.data.nextMonthRestDays
      _arr[this.data.currentCalendarPage] = _obj

      this.setData({
        calendarPage: _arr
      })

      if (_type == 0) {
        this.setData({
          currentCalendarPage: this.data.currentCalendarPage -= 1
        })
        let _month = this.data.currentChooseMonth - 1
        this.setData({
          currentChooseYear: _month <= 0 ? (this.data.currentChooseYear -= 1) : this.data.currentChooseYear,
          currentChooseMonth: _month <= 0 ? 12 : _month
        })
        if (this.data.calendarPage[this.data.currentCalendarPage] == undefined) {
          this.createDateNode(this.data.currentChooseYear, this.data.currentChooseMonth)
        } else {
          this.setData({
            lastMonthRestDays: this.data.calendarPage[this.data.currentCalendarPage].prev,
            currentMonthDayCont: this.data.calendarPage[this.data.currentCalendarPage].curr,
            nextMonthRestDays: this.data.calendarPage[this.data.currentCalendarPage].next
          })
        }
      } else if (_type == 1) {
        this.setData({
          currentCalendarPage: this.data.currentCalendarPage += 1
        })
        let _month = this.data.currentChooseMonth + 1
        this.setData({
          currentChooseYear: _month > 12 ? (this.data.currentChooseYear += 1) : this.data.currentChooseYear,
          currentChooseMonth: _month > 12 ? 1 : _month
        })
        if (this.data.calendarPage[this.data.currentCalendarPage] == undefined) {
          this.createDateNode(this.data.currentChooseYear, this.data.currentChooseMonth)
        } else {
          this.setData({
            lastMonthRestDays: this.data.calendarPage[this.data.currentCalendarPage].prev,
            currentMonthDayCont: this.data.calendarPage[this.data.currentCalendarPage].curr,
            nextMonthRestDays: this.data.calendarPage[this.data.currentCalendarPage].next
          })
        }
      }



    },

    // 获取当前页面的日期时间
    createDateNode(year, month) {
      const lastMonthRestDays = this.getLastMonthRestDays(year, month);
      const currentMonthDayCont = [];
      const nextMonthRestDays = this.getNextMonthRestDays(year, month);

      for (let i = 1; i <= this.getMonthDayCont(year, month); i++) {
        currentMonthDayCont.push(i)
      }

      const _lastMonthRestDays = this.setDate(lastMonthRestDays, 0);
      const _currentMonthDayCont = this.setDate(currentMonthDayCont, 1);
      const _nextMonthRestDays = this.setDate(nextMonthRestDays, 2);


      this.setData({
        lastMonthRestDays: _lastMonthRestDays,
        currentMonthDayCont: _currentMonthDayCont,
        nextMonthRestDays: _nextMonthRestDays
      })
    },
    // 修改数据，进行特殊判断
    setDate(arr, type) {
      let _arr = [];
      let _year = this.data.currentChooseYear;
      let _month = this.data.currentChooseMonth;
      if (_year == 1 && type == 0) {
        _year = _year - 1
        _month = 12
      }
      if (_month == 12 && type == 2) {
        _year = _year + 1
        _month = 1
      }

      if (type == 0) _month = _month - 1
      if (type == 2) _month = _month + 1

      for (let i = 0; i < arr.length; i++) {
        let obj = {};
        obj.Number = arr[i]
        obj.choose = false
        obj.timeStamp = new Date(_year + '-' + _month + '-' + arr[i]).getTime();
        if (
          new Date(_year, _month - 1, arr[i]).getDay() === 1 ||
          new Date(_year, _month - 1, arr[i]).getDay() === 3 ||
          new Date(_year, _month - 1, arr[i]).getDay() === 5
        ) {
          obj.red = true
        } else {
          obj.red = false
        }
        _arr.push(obj);
      }
      return _arr;
    },
    // 获取当前月份1号是周几
    getFirstWeekDay(year, month) {
      const date = new Date(year, month - 1, 1);
      return date.getDay();
    },
    // 获取当月的天数
    getMonthDayCont(year, month) {
      const date = new Date(year, month, 0);
      return date.getDate();
    },
    // 获取上月剩余的天数
    getLastMonthRestDays(year, month) {
      const days = this.getFirstWeekDay(year, month);
      let lastDate = this.getMonthDayCont(year, month - 1);
      const restDays = [];

      while (restDays.length < days) {
        restDays.push(lastDate--);
      }
      return restDays.reverse();
    },
    // 获取下月剩余的天数
    getNextMonthRestDays(year, month) {
      const lastMonthRestDayCont = this.getFirstWeekDay(year, month);
      const currentMonthDayCont = this.getMonthDayCont(year, month);
      const nextMonthRestDayCont = this.data.calendarDayNums - (lastMonthRestDayCont + currentMonthDayCont);
      let restDays = [];

      for (let i = 1; i <= nextMonthRestDayCont; i++) {
        restDays.push(i);
      }

      return restDays;
    },
    // 依据时间戳获取信息
    getDateInfo(timeStamp) {
      var date = timeStamp ? new Date(timeStamp) : new Date();

      return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ]
    },
    // 获取格式化后的日期
    getFormatDate(year, month, date) {
      const dateArr = [year, month, date];

      for (let i = 1; i < dateArr.length; i++) {
        dateArr[i] < 10 && (dateArr[i] = '0' + dateArr[i]);
      }

      return dateArr[0] + '年-' + dateArr[1] + '月-' + dateArr[2] + '日';
    },

    // 重置数据
    resetData() {
      let _arr = []
      this.setData({
        calendarPage: Array(50),
        currentCalendarPage: 25,
        currentChooseYear: new Date().getFullYear(),
        currentChooseMonth: new Date().getMonth() + 1,
        currentChooseDay: new Date().getDate(),
        lastMonthRestDays: [], //日历每页的上月时间
        currentMonthDayCont: [], //日历每页的当月时间
        nextMonthRestDays: [], //日历每页的下月时间
        chooseDays: [], //选中的日期
      })
    }
  },
})