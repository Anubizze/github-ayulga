const db = require('../config/database');
const { safeLang } = require('../constants');

function getSettings(language) {
  const lang = safeLang(language);
  return db.execute(
    `SELECT field_name, field_label_${lang} as field_label, field_type, default_value, is_required, order_index 
     FROM calculator_settings 
     ORDER BY order_index ASC`,
    []
  );
}

function calculate(expenses, income, subsidy_percent) {
  const subsidy_amount = expenses * (subsidy_percent / 100);
  const profit = income - expenses + subsidy_amount;
  const profit_margin = income > 0 ? (profit / income) * 100 : 0;
  return {
    expenses,
    income,
    subsidy_percent,
    subsidy_amount,
    profit,
    profit_margin,
    formatted: {
      expenses: expenses.toLocaleString('ru-RU') + ' KZT',
      income: income.toLocaleString('ru-RU') + ' KZT',
      subsidy_amount: subsidy_amount.toLocaleString('ru-RU') + ' KZT',
      profit: profit.toLocaleString('ru-RU') + ' KZT',
      profit_margin: profit_margin.toFixed(2) + '%',
    },
  };
}

function updateSettings(settings) {
  const promises = settings.map((s) =>
    db.execute(
      'UPDATE calculator_settings SET field_label_kz = ?, field_label_ru = ?, field_type = ?, default_value = ?, is_required = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE field_name = ?',
      [
        s.field_label_kz,
        s.field_label_ru,
        s.field_type,
        s.default_value,
        s.is_required,
        s.order_index,
        s.field_name,
      ]
    )
  );
  return Promise.all(promises);
}

function addSetting(data) {
  const {
    field_name,
    field_label_kz,
    field_label_ru,
    field_type,
    default_value,
    is_required,
    order_index,
  } = data;
  return db.execute(
    'INSERT INTO calculator_settings (field_name, field_label_kz, field_label_ru, field_type, default_value, is_required, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      field_name,
      field_label_kz,
      field_label_ru,
      field_type,
      default_value,
      is_required,
      order_index,
    ]
  );
}

module.exports = {
  getSettings,
  calculate,
  updateSettings,
  addSetting,
};
