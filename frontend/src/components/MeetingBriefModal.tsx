import { useEffect, useState } from 'react';
import { X, FileText, Printer, Sparkles } from 'lucide-react';
import { fetchMeetingBrief } from '../api';

interface MeetingBriefModalProps {
  customerId: string;
  onClose: () => void;
}

export const MeetingBriefModal = ({
  customerId,
  onClose,
}: MeetingBriefModalProps) => {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMeetingBrief(customerId)
      .then((res) => setBrief(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content" style={{ textAlign: 'center', padding: '48px' }}>
          <Sparkles className="animate-spin" size={28} style={{ color: 'var(--brand)', margin: '0 auto 14px', display: 'block' }} />
          <p className="text-secondary">در حال تدوین مستند جلسه...</p>
        </div>
      </div>
    );
  }

  if (!brief) return null;

  const fin = brief.financial_standing || {};
  const nba = brief.next_best_action || {};

  const kpiCards = [
    { label: 'فروش کل دوره', value: `${(fin.lifetime_revenue / 1000)?.toLocaleString()} هزار`, borderColor: 'var(--brand)' },
    { label: 'تغییرات اخیر تقاضا', value: fin.recent_trend, borderColor: 'var(--color-warning)', valueColor: fin.recent_trend?.startsWith('-') ? 'var(--color-danger)' : 'var(--color-success)' },
    { label: 'حاشیه سود ناخالص', value: fin.gross_margin, borderColor: 'var(--color-success)' },
    { label: 'میانگین تأخیر تسویه', value: fin.payment_delay, borderColor: '#6B46C1' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-box" style={{ background: 'rgba(0, 105, 55, 0.08)', color: 'var(--brand)' }}>
              <FileText size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700 }}>مستند توجیهی پیش از جلسه</h2>
              <span className="text-muted" style={{ fontSize: '12px' }}>حساب: {customerId} | تهیه‌شده توسط AI Copilot</span>
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Executive Summary */}
        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px', marginBottom: '18px' }}>
          <strong style={{ fontSize: '13px', color: 'var(--brand)', display: 'block', marginBottom: '8px' }}>
            خلاصه اجرایی حساب:
          </strong>
          <p style={{ fontSize: '13px', lineHeight: '1.8' }}>{brief.executive_summary}</p>
        </div>

        {/* Financial KPIs */}
        <div className="kpi-grid kpi-grid-4" style={{ marginBottom: '18px' }}>
          {kpiCards.map((card, i) => (
            <div key={i} className="meeting-kpi-card" style={{ borderRightColor: card.borderColor }}>
              <span className="kpi-label">{card.label}</span>
              <div className="text-mono font-bold" style={{ fontSize: '14px', color: card.valueColor }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Talking Points */}
        <div className="talking-points-box">
          <div className="talking-points-title">
            <Sparkles size={16} /> محورهای کلیدی مذاکره:
          </div>
          <ul className="talking-points-list">
            {brief.suggested_talking_points?.map((tp: string, idx: number) => (
              <li key={idx}>{tp}</li>
            ))}
          </ul>
        </div>

        {/* Recommended Action */}
        <div className="nba-box" style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '13px', color: 'var(--color-success)' }}>اقدام قطعی پیشنهادی پس از جلسه:</strong>
            <span className="badge badge-risk-high">{nba.priority}</span>
          </div>
          <p style={{ fontSize: '13px' }}>{nba.action}</p>
          <div className="text-muted" style={{ fontSize: '11px', marginTop: '6px' }}>{nba.rationale}</div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>چاپ مستند</span>
          </button>
          <button className="btn btn-primary" onClick={onClose}>بستن</button>
        </div>
      </div>
    </div>
  );
};
