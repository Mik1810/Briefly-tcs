import { topicPath } from '../lib/content/repository.ts';
import type { Topic } from '../lib/content/types.ts';

interface Props {
  topics: Topic[];
}

export default function TopicLinks({ topics }: Props) {
  return (
    <span className="topic-links">
      {topics.map((topic, index) => (
        <span key={topic.slug}>
          {index > 0 ? ', ' : null}
          <a href={topicPath(topic)}>{topic.name}</a>
        </span>
      ))}
    </span>
  );
}
