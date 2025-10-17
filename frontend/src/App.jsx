// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import './App.css'


const App = () => {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		// Fetch events from the server
		axios.get('https://event-management-b07c.onrender.com/api/events')
			.then(response => setEvents(response.data))
			.catch(error => console.error(error));
	}, []);

	const handleEventAdd = (newEvent) => {
		setEvents([...events, newEvent]);
	};

	const handleEventDelete = (id) => {
		console.log("delete event " + id)
		// Delete an event
		axios.delete(`https://event-management-b07c.onrender.com/api/events/${id}`)
			.then(
				() =>
					setEvents(events.filter(event => event._id !== id)))
			.catch(error => console.error(error));
	};

	const handleToggleReminder = (eventId) => {
		// console.log('HI');

		// Find the event by ID
		const selectedEvent =
			events.find(event => event._id === eventId);

		// Toggle the reminder status
		const updatedEvent =
		{
			...selectedEvent,
			reminder: !selectedEvent.reminder
		};

		// console.log('Updated',updatedEvent);


		// Update the event in the database
		axios.put(`https://event-management-b07c.onrender.com/api/events/${eventId}`, updatedEvent)
			.then(() => {
				// console.log('res',response.data);

				// If the update is successful, update the events in the state
				const updatedEvents = events.map(event =>
					event._id === eventId ? updatedEvent : event
				);
				setEvents(updatedEvents);
			})
			.catch(
				error =>
					console.error(`Error updating reminder status for
				event with ID ${eventId}:`, error));
	};

	const onEventEdit = (eventId, updatedData) => {
		// Update the event in the database
		axios.put(`https://event-management-b07c.onrender.com/api/events/${eventId}`, updatedData)
			.then(() => {
				// If the update is successful, update the events in the state
				const updatedEvents = events.map(event =>
					event._id ===
						eventId ?
						{ ...event, ...updatedData } : event
				);
				setEvents(updatedEvents);
			})
			.catch(
				error =>
					console.error(`Error updating event with
						ID ${eventId}:`, error)
			);
	};

	return (
		<div className='main-container'>
			<h1 className='gfg'>
				Skai Lama
			</h1>
			<h2>Event Management App</h2>
			<EventForm onEventAdd={handleEventAdd} />
			<EventList
				events={events}
				onEventDelete={handleEventDelete}
				onToggleReminder={handleToggleReminder}
				onEventEdit={onEventEdit}
			/>
		</div>
	);
};

export default App;
