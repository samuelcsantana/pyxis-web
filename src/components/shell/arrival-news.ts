import type { ScreenSlug } from './screens';

export interface ScreenNews {
  readonly shown: string;
  readonly label: string;
}

export type ArrivalNews = Readonly<Partial<Record<ScreenSlug, ScreenNews>>>;

export interface OpenScreenNews extends ScreenNews {
  readonly screen: ScreenSlug;
}

export interface ScreenReadNote {
  readonly path: string;
  readonly readAt: number;
}

type Listener = () => void;

const NO_NEWS: ArrivalNews = {};
const newsListeners = new Set<Listener>();
const openNewsListeners = new Set<Listener>();
const readListeners = new Set<Listener>();
const pendingReads: ScreenReadNote[] = [];
let news = NO_NEWS;
let openNews: OpenScreenNews | undefined;

function listenTo(listeners: Set<Listener>, listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(listeners: ReadonlySet<Listener>) {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeToArrivalNews(listener: Listener): () => void {
  return listenTo(newsListeners, listener);
}

export function arrivalNews(): ArrivalNews {
  return news;
}

export function noArrivalNews(): ArrivalNews {
  return NO_NEWS;
}

export function publishArrivalNews(next: ArrivalNews): void {
  news = next;
  notify(newsListeners);
}

export function subscribeToOpenScreenNews(listener: Listener): () => void {
  return listenTo(openNewsListeners, listener);
}

export function openScreenNews(): OpenScreenNews | undefined {
  return openNews;
}

export function noOpenScreenNews(): undefined {
  return undefined;
}

export function publishOpenScreenNews(next: OpenScreenNews | undefined): void {
  openNews = next;
  notify(openNewsListeners);
}

export function noteScreenRead(note: ScreenReadNote): void {
  pendingReads.push(note);
  notify(readListeners);
}

export function subscribeToScreenReads(listener: Listener): () => void {
  return listenTo(readListeners, listener);
}

export function takeScreenReads(): readonly ScreenReadNote[] {
  return pendingReads.splice(0);
}
