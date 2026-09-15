const form = document.querySelector('#course-form');
const nameInput = document.querySelector('#name-input');
const teacherInput = document.querySelector('#teacher-input');
const daySelect = document.querySelector('#day-select');
const periodSelect = document.querySelector('#period-select');
const roomInput = document.querySelector('#room-input');
const submitBtn = document.querySelector('#submit-btn');
const tip = document.querySelector('#tip');
const list = document.querySelector('#course-list');
const dayFilter = document.querySelector('#day-filter');
const exportBtn = document.querySelector('#export-btn');

// 研究③：读取容错——存档被写坏（不是合法 JSON）时不能让页面直接崩
let courses = [];
try {
  courses = JSON.parse(localStorage.getItem('courses') || '[]');
} catch (e) {
  courses = [];
  tip.textContent = '本地存档已损坏，已重置为空白课表';
}
let filterDay = '';
let editingCourse = null;   // 正在修改的那门课（数组里的对象），null 表示添加模式

// 研究③：写入容错——本地存储写满（QuotaExceededError）时给用户友好提示，不让页面报错
const save = () => {
  try {
    localStorage.setItem('courses', JSON.stringify(courses));
    return true;
  } catch (e) {
    console.warn('保存失败:', e.name, e.message);
    tip.textContent = '保存失败：本地存储空间不足，请清理后再试（' + e.name + '）';
    return false;   // 告诉调用方：没存成
  }
};

const render = () => {
  list.innerHTML = '';

  const shown = courses.filter(c =>
    filterDay === '' ? true : c.day === filterDay
  );

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的课程';
    list.appendChild(li);
    return;
  }

  shown.forEach(course => {
    const li = document.createElement('li');
    li.textContent = course.name + ' · ' + course.teacher + ' · ' + course.day + ' ' + course.period + ' · ' + course.room;

    const edit = document.createElement('span');
    edit.classList.add('edit');
    edit.textContent = '修改';
    li.appendChild(edit);

    const del = document.createElement('span');
    del.classList.add('del');
    del.textContent = '删除';
    li.appendChild(del);

    li.dataset.index = courses.indexOf(course);

    list.appendChild(li);
  });
};

// 研究①：事件委托——整张列表只挂 1 个监听器（重构前是每个 li 各挂 1 个，N 门课就是 N 个）
list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li || li.dataset.index === undefined) return;   // 占位行（没有符合条件的课程）不处理
  const course = courses[Number(li.dataset.index)];

  if (e.target.classList.contains('del')) {
    if (editingCourse === course) {
      editingCourse = null;
      submitBtn.textContent = '添加课程';
    }
    courses = courses.filter(c => c !== course);
    save();
    render();
  } else if (e.target.classList.contains('edit')) {
    nameInput.value = course.name;
    teacherInput.value = course.teacher;
    daySelect.value = course.day;
    periodSelect.value = course.period;
    roomInput.value = course.room;
    editingCourse = course;
    submitBtn.textContent = '保存修改';
    tip.textContent = '正在修改：' + course.name;
  }
});

dayFilter.addEventListener('change', () => {
  filterDay = dayFilter.value;
  render();
});

// 研究②：导出 JSON 文件——Blob 造出一个“文件对象”，createObjectURL 给它一个临时地址，用 a[download] 触发下载
exportBtn.addEventListener('click', () => {
  const data = JSON.stringify(courses, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'courses.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);   // 等下载启动后再释放临时地址
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const teacher = teacherInput.value.trim();
  const room = roomInput.value.trim();
  const day = daySelect.value;
  const period = periodSelect.value;

  if (name === '') {
    tip.textContent = '课程名不能为空';
    return;
  }
  if (teacher === '') {
    tip.textContent = '教师不能为空';
    return;
  }
  if (room === '') {
    tip.textContent = '上课地点不能为空';
    return;
  }

  if (editingCourse === null) {
    courses.push({ name: name, teacher: teacher, day: day, period: period, room: room });
  } else {
    editingCourse.name = name;
    editingCourse.teacher = teacher;
    editingCourse.day = day;
    editingCourse.period = period;
    editingCourse.room = room;
    editingCourse = null;
    submitBtn.textContent = '添加课程';
  }

  if (save()) tip.textContent = '';   // 只有真的存成了才清空提示，否则保留“保存失败”提示
  nameInput.value = '';
  teacherInput.value = '';
  roomInput.value = '';
  render();
});

render();