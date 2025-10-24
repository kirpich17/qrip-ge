const fs = require('fs');

// Read the current Russian translations file
const ruFile = './locales/ru.json';
const content = fs.readFileSync(ruFile, 'utf8');

// Remove the last closing brace
const modifiedContent = content.slice(0, -1);

// Add the adminTestimonials translations
const adminTestimonialsTranslations = `,
  "adminTestimonials": {
    "header": {
      "title": "Управление Отзывами"
    },
    "table": {
      "headers": {
        "testimonial": "Отзывы",
        "submitted": "Подано"
      },
      "status": {
        "approved": "Одобрено",
        "rejected": "Отклонено",
        "pending": "Ожидает"
      },
      "actions": {
        "approve": "Одобрить",
        "reject": "Отклонить",
        "markPending": "Отметить как ожидающий",
        "delete": "Удалить"
      }
    },
    "search": {
      "placeholder": "Поиск отзывов...",
      "filterByStatus": "Фильтр по статусу",
      "allStatus": "Все статусы",
      "pending": "Ожидает",
      "approved": "Одобрено",
      "rejected": "Отклонено"
    },
    "empty": {
      "title": "Отзывы не найдены",
      "description": "В данный момент нет отзывов для отображения."
    },
    "pagination": {
      "previous": "Предыдущая",
      "next": "Следующая",
      "pageInfo": "Страница {currentPage} из {totalPages}"
    },
    "settings": {
      "title": "Настройки Отзывов",
      "enableSection": "Включить секцию отзывов",
      "enableSectionDescription": "Разрешить пользователям подавать отзывы на сайте",
      "autoApprove": "Автоодобрение отзывов",
      "autoApproveDescription": "Автоматически одобрять новые отзывы без ручной проверки",
      "requireEmail": "Требовать адрес электронной почты",
      "requireEmailDescription": "Сделать адрес электронной почты обязательным для подачи отзывов",
      "maxDisplay": "Максимальное количество отображения"
    }
  }
}`;

// Write the modified content back to the file
fs.writeFileSync(ruFile, modifiedContent + adminTestimonialsTranslations + '\n}');

console.log('Russian translations added successfully!');
