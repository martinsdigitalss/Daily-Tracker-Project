import React from 'react';

const DateNavigator = ({ selectedDate, setSelectedDate }) => {
  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <button className="btn-outline" onClick={() => changeDate(-1)}>← Previous Day</button>
      <button className="btn-outline" onClick={() => changeDate(1)}>Next Day →</button>
    </div>
  );
};

export default DateNavigator;
