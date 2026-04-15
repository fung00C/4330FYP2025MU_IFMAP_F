import React, {useState} from 'react';
const NotificationSetting = () => {
    const [Time, setTime] = useState('08:00');
    const [frequency, setFrequency] = useState('daily');
    const [weeklyDay, setWeeklyDay] = useState('monday');
    const [monthlyDate, setMonthlyDate] = useState('1');


    return (
        <>
            <h1>Notification Setting</h1>
            
            <p>Set the frequency for email notifications.</p>
            <div>
                <input
                    type="radio"
                    id="daily"
                    name="frequency"
                    value="daily"
                    checked={frequency === 'daily'}
                    onChange={() => setFrequency('daily')}
                />
                <label htmlFor="daily">Daily</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="weekly"
                    name="frequency"
                    value="weekly"
                    checked={frequency === 'weekly'}
                    onChange={() => setFrequency('weekly')}
                />
                <label htmlFor="weekly">Weekly</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="monthly"
                    name="frequency"
                    value="monthly"
                    checked={frequency === 'monthly'}
                    onChange={() => setFrequency('monthly')}
                />
                <label htmlFor="monthly">Monthly</label>
            </div>

            {frequency === 'daily' && (
                <div>
                    <label htmlFor="Time">Choose time:</label>
                    <input
                        type="time"
                        id="Time"
                        value={Time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            )}

            {frequency === 'weekly' && (
                <div>
                    <label htmlFor="weeklyDay">Choose day:</label>
                    <select
                        id="weeklyDay"
                        value={weeklyDay}
                        onChange={(e) => setWeeklyDay(e.target.value)}
                    >
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                    </select>

                    <label htmlFor="Time">Choose time:</label>
                    <input
                        type="time"
                        id="Time"
                        value={Time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            )}

            {frequency === 'monthly' && (
                <div>
                    <label htmlFor="monthlyDate">Choose date:</label>
                    <input
                        type="number"
                        id="monthlyDate"
                        min="1"
                        max="31"
                        value={monthlyDate}
                        onChange={(e) => setMonthlyDate(e.target.value)}
                    />

                    <label htmlFor="Time">Choose time:</label>
                    <input
                        type="time"
                        id="Time"
                        value={Time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            )}
            <button>Save Settings</button>
        </>
    );
};
export default NotificationSetting;