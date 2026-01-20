import type { EventWithVenues } from "@/lib/validation/db";

export type EventRow = {
  id: string;
  user_id: string;
  name: string;
  sport_type: EventWithVenues["sport_type"];
  starts_at: string;
  description: string | null;
};

export type EventVenueRow = {
  id: string;
  event_id: string;
  name: string;
};

export function sortEvents(events: EventWithVenues[]): EventWithVenues[] {
  return [...events].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}

export function upsertEvent(
  events: EventWithVenues[],
  row: EventRow
): EventWithVenues[] {
  const next = [...events];
  const existingIndex = next.findIndex((event) => event.id === row.id);
  const existing = existingIndex >= 0 ? next[existingIndex] : undefined;
  
  const updated: EventWithVenues = {
    id: row.id,
    name: row.name,
    sport_type: row.sport_type,
    starts_at: row.starts_at,
    description: row.description,
    event_venues: existing?.event_venues ?? [],
  };

  if (existingIndex >= 0) {
    next[existingIndex] = updated;
  } else {
    next.push(updated);
  }

  return sortEvents(next);
}

export function removeEvent(
  events: EventWithVenues[],
  eventId: string
): EventWithVenues[] {
  return events.filter((event) => event.id !== eventId);
}

export function updateEventVenues(
  events: EventWithVenues[],
  eventId: string,
  nextVenues: EventWithVenues["event_venues"]
): EventWithVenues[] {
  const index = events.findIndex((event) => event.id === eventId);
  if (index < 0) {
    return events;
  }

  const next = [...events];
  next[index] = { ...next[index], event_venues: nextVenues };
  return next;
}

export function addVenue(
  events: EventWithVenues[],
  eventId: string,
  venueName: string
): EventWithVenues[] {
  const index = events.findIndex((event) => event.id === eventId);
  if (index < 0) {
    return events;
  }

  const next = [...events];
  const event = next[index];

  if (event.event_venues.some((venue) => venue.name === venueName)) {
    return events;
  }

  next[index] = {
    ...event,
    event_venues: [...event.event_venues, { name: venueName }],
  };

  return next;
}

export function removeVenue(
  events: EventWithVenues[],
  eventId: string,
  venueName: string
): EventWithVenues[] {
  const index = events.findIndex((event) => event.id === eventId);
  if (index < 0) {
    return events;
  }

  const next = [...events];
  const event = next[index];
  const venueIndex = event.event_venues.findIndex((venue) => venue.name === venueName);

  if (venueIndex < 0) {
    return events;
  }

  const nextVenues = [...event.event_venues];
  nextVenues.splice(venueIndex, 1);
  next[index] = { ...event, event_venues: nextVenues };

  return next;
}

export function updateVenue(
  events: EventWithVenues[],
  eventId: string,
  oldName: string,
  newName: string
): EventWithVenues[] {
  if (oldName === newName) {
    return events;
  }

  const index = events.findIndex((event) => event.id === eventId);
  if (index < 0) {
    return events;
  }

  const next = [...events];
  const event = next[index];
  const venueIndex = event.event_venues.findIndex((venue) => venue.name === oldName);

  if (venueIndex < 0) {
    return events;
  }

  const nextVenues = [...event.event_venues];
  nextVenues[venueIndex] = { name: newName };
  next[index] = { ...event, event_venues: nextVenues };

  return next;
}
