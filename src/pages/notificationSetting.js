import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimage from '../image/home.png'
const NotificationSetting = () => {
    const [Time, setTime] = useState('');
    const [frequency, setFrequency] = useState('');
    const [weeklyDay, setWeeklyDay] = useState('');
    const [monthlyDate, setMonthlyDate] = useState('');
    const email = localStorage.getItem('user_email');
    const navigate = useNavigate();
   function homeClick(){
      navigate("/")
    useEffect(() => {
        fetch(`http://localhost:8000/bookmarks/get_notification_setting?email=${email}`)
            .then(res => res.json())
            .then(data => {
                if (data.data.time_of_day) setTime(data.data.time_of_day);
                if (data.data.frequency) setFrequency(data.data.frequency);
                if (data.data.day_of_week) setWeeklyDay(data.data.day_of_week);
                if (data.data.date_of_month) setMonthlyDate(data.data.date_of_month);
            })
            .catch(err => console.error('Error fetching notification settings:', err));
    }, [email]);

    const handleSaveSettings = async () => {
        console.log('Saving settings for frequency:', frequency);
        console.log('Time:', Time, 'weeklyDay:', weeklyDay, 'monthlyDate:', monthlyDate);

        if (frequency === 'daily') {
            console.log('Making daily request...');
            await fetch(`http://localhost:8000/bookmarks/update_notification_setting?email=${email}&time_of_day=${Time}&frequency=daily`, {
                method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
            })
            .then(res => {
                console.log('Daily response:', res);
                return res.json();
            })
            .then(data => console.log('Daily data:', data))
            .catch(err => console.error('Failed to save daily settings:', err));
        }
        else if (frequency === 'weekly') {
            console.log('Making weekly request...');
            await fetch(`http://localhost:8000/bookmarks/update_notification_setting?email=${email}&time_of_day=${Time}&frequency=weekly&day_of_week=${weeklyDay}`, {
                method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
            })
            .then(res => {
                console.log('Weekly response:', res);
                return res.json();
            })
            .then(data => console.log('Weekly data:', data))
            .catch(err => console.error('Failed to save weekly settings:', err)); 
        }
        else if (frequency === 'monthly') {
            console.log('Making monthly request...');
            await fetch(`http://localhost:8000/bookmarks/update_notification_setting?email=${email}&time_of_day=${Time}&frequency=monthly&date_of_month=${monthlyDate}`, {
                method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
            })
            .then(res => {
                console.log('Monthly response:', res);
                return res.json();
            })
            .then(data => console.log('Monthly data:', data))
            .catch(err => console.error('Failed to save monthly settings:', err)); 
        }

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
                    onChange={() => {
                        setFrequency('weekly');
                        if (!weeklyDay) setWeeklyDay('Monday');
                    }}
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
                    onChange={() => {
                        setFrequency('monthly');
                        if (!monthlyDate) setMonthlyDate(1);
                    }}
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
                        value={weeklyDay || "Monday"}
                        onChange={(e) => setWeeklyDay(e.target.value)}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
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
                        value={monthlyDate || 1}
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
            <button style={{ marginTop: '20px' }} onClick={handleSaveSettings}>Save Settings</button>
        </>
    );
};
export default NotificationSetting;