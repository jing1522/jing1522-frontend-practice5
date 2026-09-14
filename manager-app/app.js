const form = document.querySelector('#course-form');
const nameInput = document.querySelector('#name-input');
const teacherInput = document.querySelector('#teacher-input');
const daySelect = document.querySelector('#day-select');
const periodSelect = document.querySelector('#period-select');
const roomInput = document.querySelector('#room-input');
const submitBtn = document.querySelector('#submit-btn');
const tip = document.querySelector('#tip');
const list = document.querySelector('#course-list');

let courses = [];

const clearForm = () => {
  nameInput.value = '';
  teacherInput.value = '';
  roomInput.value = '';
  daySelect.value = '周一';
  periodSelect.value = '1-2节';
  submitBtn.textContent = '添加课程';
};

const render = () => {
  list.innerHTML = '';

  if (courses.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.className = 'empty';
    td.textContent = '还没有课程，先添加一门吧';
    tr.appendChild(td);
    list.appendChild(tr);
    return;
  }

  courses.forEach(course => {
    const tr = document.createElement('tr');
    [course.name, course.teacher, course.day, course.period, course.room].forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    list.appendChild(tr);
  });
};

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

  const clash = courses.find(c => c.day === day && c.period === period);
  if (clash) {
    tip.textContent = '时间冲突：' + day + ' ' + period + ' 已有「' + clash.name + '」';
    return;
  }

  courses.push({
    id: Date.now(),
    name: name,
    teacher: teacher,
    day: day,
    period: period,
    room: room
  });

  tip.textContent = '已添加：' + name;
  clearForm();
  render();
});

clearForm();
render();