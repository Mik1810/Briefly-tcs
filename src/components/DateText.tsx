import { formatDate } from '../lib/dates.ts';

interface Props {
  date: string;
}

export default function DateText({ date }: Props) {
  return <time dateTime={date}>{formatDate(date)}</time>;
}
