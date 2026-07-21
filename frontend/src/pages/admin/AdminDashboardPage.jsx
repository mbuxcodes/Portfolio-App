import Card from '@/components/Card';

// TODO (Milestone 2): replace with real counts from respective admin list endpoints
const placeholderStats = [
  { label: 'Total Projects', value: '—' },
  { label: 'New Messages', value: '—' },
  { label: 'Total Skills', value: '—' },
];

function AdminDashboardPage() {
  return (
    <div>
      <h1 className="pb-lg">Dashboard</h1>
      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        {placeholderStats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-small text-muted">{stat.label}</p>
            <p className="pt-1 text-h1 font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
