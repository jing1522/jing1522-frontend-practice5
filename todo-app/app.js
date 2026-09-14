const form = document.querySelector('#add-form');
const input = document.querySelector('#task-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#task-list');
const filters = document.querySelector('.filters');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const render = () => {
  list.innerHTML = '';
  const shown = tasks.filter(t =>
    currentFilter === 'all' ? true :
    currentFilter === 'active' ? !t.done : t.done
  );
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的任务';
    list.appendChild(li);
    return;
  }
  shown.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.done) li.classList.add('done');

    const edit = document.createElement('span');
    edit.classList.add('edit');
    edit.textContent = '编辑';
    li.appendChild(edit);

    const del = document.createElement('span');
    del.classList.add('del');
    del.textContent = '×';
    li.appendChild(del);

    li.addEventListener('click', (e) => {
      if (li.querySelector('input') !== null) return;   // 已经在编辑时，点行里其它地方不响应

      if (e.target.classList.contains('del')) {
        tasks = tasks.filter(t => t !== task);
        save();
        render();
      } else if (e.target.classList.contains('edit')) {
        li.innerHTML = '';
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = task.text;
        li.appendChild(editInput);
        editInput.focus();

        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const newText = editInput.value.trim();
            if (newText === '') {
              tip.textContent = '任务名不能为空';
              return;
            }
            task.text = newText;
            tip.textContent = '';
            save();
            render();
          }
        });
      } else {
        task.done = !task.done;
        save();
        render();
      }
    });

    list.appendChild(li);
  });
};

filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter;
  render();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    tip.textContent = '任务名不能为空';
    return;
  }
  tasks.push({ text: text, done: false });
  tip.textContent = '';
  input.value = '';
  save();
  render();
});

render();
