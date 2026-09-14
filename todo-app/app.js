const form = document.querySelector('#course-form');
const nameInput = document.querySelector('#name-input');
const teacherInput = document.querySelector('#teacher-input');
const daySelect = document.querySelector('#day-select');
const periodSelect = document.querySelector('#period-select');
const roomInput = document.querySelector('#room-input');
const submitBtn = document.querySelector('#submit-btn');
const tip = document.querySelector('#tip');
const list = document.querySelector('#course-list');
const searchInput = document.querySelector('#search-input');
const dayFilter = document.querySelector('#day-filter');

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

let courses = [];
let keyword = '';
let filterDay = '';
let editId = null;

const clearForm = () => {
  nameInput.value = '';
  teacherInput.value = '';
  roomInput.value = '';
  daySelect.value = '周一';
  periodSelect.value = '1-2节';
  editId = null;
  submitBtn.textContent = '添加课程';
};

const render = () => {
  list.innerHTML = '';

  const shown = courses
    .filter(c => filterDay === '' || c.day === filterDay)
    .filter(c => c.name.includes(keyword) || c.teacher.includes(keyword))
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.period.localeCompare(b.period));

  if (shown.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.className = 'empty';
    td.textContent = courses.length === 0 ? '还没有课程，先添加一门吧' : '没有符合条件的课程';
    tr.appendChild(td);
    list.appendChild(tr);
    return;
  }

  shown.forEach(course => {
    const tr = document.createElement('tr');
    [course.name, course.teacher, course.day, course.period, course.room].forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    const opTd = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = '编辑';
    editBtn.dataset.action = 'edit';
    editBtn.dataset.id = course.id;
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.dataset.action = 'del';
    delBtn.dataset.id = course.id;
    opTd.appendChild(editBtn);
    opTd.appendChild(delBtn);
    tr.appendChild(opTd);

    list.appendChild(tr);
  });
};

list.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const id = Number(btn.dataset.id);

  if (btn.dataset.action === 'del') {
    const course = courses.find(c => c.id === id);
    courses = courses.filter(c => c.id !== id);
    if (editId === id) clearForm();
    tip.textContent = '已删除：' + course.name;
    render();
  } else if (btn.dataset.action === 'edit') {
    const course = courses.find(c => c.id === id);
    nameInput.value = course.name;
    teacherInput.value = course.teacher;
    daySelect.value = course.day;
    periodSelect.value = course.period;
    roomInput.value = course.room;
    editId = id;
    submitBtn.textContent = '保存修改';
    tip.textContent = '正在编辑：' + course.name + '（改完点"保存修改"）';
  }
});

searchInput.addEventListener('input', () => {
  keyword = searchInput.value.trim();
  render();
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
  if (name.length > 20) {
    tip.textContent = '课程名太长，请控制在20字以内';
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

  const clash = courses.find(c => c.day === day && c.period === period && c.id !== editId);
  if (clash) {
    tip.textContent = '时间冲突：' + day + ' ' + period + ' 已有「' + clash.name + '」';
    return;
  }

  if (editId === null) {
    courses.push({
      id: Date.now(),
      name: name,
      teacher: teacher,
      day: day,
      period: period,
      room: room
    });
    tip.textContent = '已添加：' + name;
  } else {
    const course = courses.find(c => c.id === editId);
    course.name = name;
    course.teacher = teacher;
    course.day = day;
    course.period = period;
    course.room = room;
    tip.textContent = '已保存修改：' + name;
  }

  clearForm();
  render();
});

clearForm();
render();