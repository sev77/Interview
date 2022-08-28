Page({
  data: {
    showCalendar: false,
    word: ''
  },
  onLoad() {

  },
  onShow() {

  },
  // 显示日历
  showCalendarFloat() {
    const _year = new Date().getFullYear();
    const _month = new Date().getMonth() + 1;
    this.selectComponent('#calendar').createDateNode(_year, _month);

    this.setData({
      showCalendar: true
    })
  },
  // 
  hideCalendar(e) {
    this.setData({
      showCalendar: false,
      word: e.detail.word != '' ? e.detail.word.join(',') : ''
    })
    this.selectComponent('#calendar').resetData();
  }
})