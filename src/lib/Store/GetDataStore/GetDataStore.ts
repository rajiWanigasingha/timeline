import { writable, type Writable } from 'svelte/store';
import { getLocalTimeZone, today } from '@internationalized/date';

const date = today(getLocalTimeZone());

const DateStore: Writable<{ year: number; month: number; day: number }[]> = writable([
	{ year: date.year, month: date.month, day: date.day}
]);

export default DateStore;
