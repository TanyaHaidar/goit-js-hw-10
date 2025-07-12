import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const dateInput = document.getElementById('datetime-picker');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let countdownInterval = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: '❗',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  dateInput.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeDiff = userSelectedDate - now;

    if (timeDiff <= 0) {
      clearInterval(countdownInterval);
      updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateInput.disabled = false;
      return;
    }

    updateInterface(convertMs(timeDiff));
  }, 1000);
});

function updateInterface({ days, hours, minutes, seconds }) {
  timerFields.days.textContent = formatTime(days);
  timerFields.hours.textContent = formatTime(hours);
  timerFields.minutes.textContent = formatTime(minutes);
  timerFields.seconds.textContent = formatTime(seconds);
}

function formatTime(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}
