import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';

// Event type
type EventType = {
  title: string;
  location: string;
  details: string;
};

const events: EventType[] = [
  {
    title: '18 March – Social Media',
    location: 'Willson Tech Park',
    details:
      'A deep dive into Instagram, LinkedIn strategy, and content trends for 2025. Great opportunity to network and learn with experts in the field.',
  },
  {
    title: '22 June – Mobile Marketing',
    location: 'Orangi Town, Karachi',
    details:
      'Learn SMS strategy, push notifications, mobile app monetization and targeting. Ideal for startups and digital marketers.',
  },
];

const addToCalendar = async (event: EventType) => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access calendar was denied');
      return false;
    }

const defaultSource =
  Platform.OS === 'ios'
    ? await getDefaultCalendarSource()
    : {
        isLocalAccount: true,
        name: 'Expo Calendar',
        type: Calendar.SourceType.LOCAL, // ✅ required field
      };


    const calendarId = await Calendar.createCalendarAsync({
      title: 'ADX Events',
      color: '#4f46e5',
      entityType: Calendar.EntityTypes.EVENT,
      source: defaultSource,
      name: 'ADX Internal',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);

    await Calendar.createEventAsync(calendarId, {
      title: event.title,
      location: event.location,
      notes: event.details,
      startDate: now,
      endDate: end,
      timeZone: 'Asia/Karachi',
    });

    return true;
  } catch (error) {
    console.error('Calendar error:', error);
    return false;
  }
};

const getDefaultCalendarSource = async () => {
  const calendars = await Calendar.getCalendarsAsync();
  const defaultCalendars = calendars.filter(
    (cal) => cal.source?.name === 'Default'
  );
  return defaultCalendars.length
    ? defaultCalendars[0].source
    : calendars[0].source;
};

const EventCard = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isEventAdded, setIsEventAdded] = useState(false);

  const handleAdd = async () => {
    if (selectedEvent) {
      const added = await addToCalendar(selectedEvent);
      if (added) {
        setIsEventAdded(true);
        setTimeout(() => {
          setIsEventAdded(false);
          setSelectedEvent(null);
        }, 1500);
      }
    }
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.header}>Upcoming Events</Text>

        {events.map((event, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedEvent(event)}
            activeOpacity={0.8}
          >
            <View style={styles.eventRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#4f46e5" />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedEvent && (
        <Modal
          visible={true}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setSelectedEvent(null)}
              activeOpacity={0.6}>
                <MaterialCommunityIcons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalLocation}>{selectedEvent.location}</Text>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalDetails}>{selectedEvent.details}</Text>
              </ScrollView>

              <TouchableOpacity style={styles.ctaBtn} onPress={handleAdd} activeOpacity={0.6}>
                <Text style={styles.ctaText}>Add to Calendar</Text>
              </TouchableOpacity>

              {isEventAdded && (
                <View style={styles.successMessage}>
                  <Text style={styles.successText}>✅ Event added to calendar!</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  eventLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 10,
  },
  modalLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalDetails: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  ctaBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  successMessage: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#15803d',
    fontWeight: '600',
  },
});
