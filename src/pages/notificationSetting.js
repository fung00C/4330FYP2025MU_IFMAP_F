import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import homeimage from '../image/home.png'
const NotificationSetting = () => {
    const [Time, setTime] = useState('08:00');
    const [frequency, setFrequency] = useState('daily');
    const [weeklyDay, setWeeklyDay] = useState('monday');
    const [monthlyDate, setMonthlyDate] = useState('1');
    const navigate = useNavigate();
 function homeClick(){
      navigate("/")
    }

    return (
        <>
            <h1>Notification Setting</h1>
            <button className='homebutton' onClick={homeClick}><img src={homeimage} alt="" className='homeicon'/></button>
            <div className="background"></div>
            <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%' 
        }}>
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
                    <label htmlFor="Time" style={{ marginRight: '10px' }}>Choose time:</label>
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
                    <label htmlFor="weeklyDay" style={{ marginRight: '10px' }}>Choose day:</label>
                    <select
                        id="weeklyDay"
                        value={weeklyDay}
                        onChange={(e) => setWeeklyDay(e.target.value)}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                    </select>

                    <label htmlFor="Time" style={{ marginRight: '10px' }}>Choose time:</label>
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
                    <label htmlFor="monthlyDate" style={{ marginRight: '10px' }}>Choose date:</label>
                    <input
                        type="number"
                        id="monthlyDate"
                        min="1"
                        max="31"
                        value={monthlyDate}
                        onChange={(e) => setMonthlyDate(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />

                    <label htmlFor="Time" style={{ marginRight: '10px' }}>Choose time:</label>
                    <input
                        type="time"
                        id="Time"
                        value={Time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            )}
            <button style={{ marginTop: '20px' }}>Save Settings</button>
            </div>
        </>
    );
};
export default NotificationSetting;