import React from 'react';
import { Check, Clock, Package, Truck, Home, AlertCircle, MapPin } from 'lucide-react';

const STEPS = [
  { key: 'Placed', label: 'Order Placed', icon: Clock },
  { key: 'Processing', label: 'Processing', icon: Package },
  { key: 'Shipped', label: 'In Transit', icon: Truck },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Home },
];

export const OrderTimeline = ({ order }) => {
  if (!order) return null;

  if (order.status === 'Cancelled') {
    return (
      <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', textAlign: 'center', margin: '2rem 0' }}>
        <AlertCircle size={36} color="#EF4444" style={{ margin: '0 auto 0.75rem' }} />
        <h3 style={{ color: '#F87171', marginBottom: '0.4rem' }}>This order has been cancelled</h3>
        <p style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>
          Payment authorization has been released and stock restored to inventory.
        </p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const progressPercent = Math.min(100, Math.max(0, (activeIndex / (STEPS.length - 1)) * 100));

  return (
    <div>
      {/* Horizontal Visual Progress Bar */}
      <div className="stepper-container">
        <div className="stepper-bar-bg">
          <div
            className="stepper-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;
          const StepIcon = step.icon;

          return (
            <div className="step-node" key={step.key}>
              <div
                className={`step-circle ${
                  isCompleted ? 'completed' : isCurrent ? 'current' : ''
                }`}
              >
                {isCompleted ? <Check size={20} /> : <StepIcon size={18} />}
              </div>
              <span className={`step-label ${isCurrent || isCompleted ? 'active' : ''}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Milestone Event Log */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#818CF8', marginBottom: '1rem' }}>
            Live Tracking Milestones
          </h4>

          <div className="timeline-logs">
            {order.statusHistory
              .slice()
              .reverse()
              .map((evt, idx) => {
                const dateStr = new Date(evt.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div className="timeline-event" key={idx}>
                    <div className="timeline-dot" />
                    <div className="timeline-event-time">{dateStr}</div>
                    <div className="timeline-event-title">{evt.status}</div>
                    <div className="timeline-event-note">{evt.note}</div>
                    {evt.location && (
                      <div className="timeline-event-loc">
                        <MapPin size={12} />
                        <span>{evt.location}</span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
