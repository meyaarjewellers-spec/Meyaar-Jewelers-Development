interface WelcomeMessageProps {
  firstName: string;
}

export function WelcomeMessage({ firstName }: WelcomeMessageProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold" style={{ color: 'rgb(167, 98, 68)' }}>
        Hi, {firstName}!
      </h2>
    </div>
  );
}
