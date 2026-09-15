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

let courses = JSON.parse(localStorage.getItem('courses') || '[]');
let filterDay = '';
let editingCourse = null;   // 正在修改的那门课（数组里的对象），null 表示添加模式

const save = () => localStorage.setItem('courses', JSON.stringify(courses));

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

  save();
  tip.textContent = '';
  nameInput.value = '';
  teacherInput.value = '';
  roomInput.value = '';
  render();
});

render();