import { useEffect, useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertOctagon, ArrowDown, Sparkles } from 'lucide-react';
import { fetchQualityChain } from '../api';

interface QualityChainModalProps {
  complaintId: string;
  customerId: string;
  onClose: () => void;
}

export const QualityChainModal = ({
  complaintId,
  customerId,
  onClose,
}: QualityChainModalProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchQualityChain(customerId, complaintId)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [complaintId, customerId]);

  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content" style={{ textAlign: 'center', padding: '48px' }}>
          <Sparkles className="animate-spin" size={28} style={{ color: 'var(--brand)', margin: '0 auto 14px', display: 'block' }} />
          <p className="text-secondary">در حال کاوش زنجیره علت ریشه‌ای...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const cmp = data.complaint || {};
  const bridges = data.bridge_links || [];
  const labs = data.quality_lab_records || [];
  const isFailed = data.investigation_verdict?.includes('Failed');

  const hops = [
    {
      color: 'var(--brand)',
      title: '۱. رویداد ثبت شکایت در سیستم QMS',
      body: (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>عنوان: <strong>{cmp.complaint_title}</strong> (شدت: {cmp.severity})</span>
            <span>تاریخ: {cmp.created_at}</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{cmp.complaint_text}</p>
        </>
      ),
    },
    {
      color: '#6B46C1',
      title: '۲. پل اتصال به خطوط فروش ERP',
      body: (
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          تعداد خطوط متصل: <strong>{bridges.length} خط فروش</strong> | فاکتور: {bridges[0]?.invoice_number || '-'} | برگشتی: {bridges[0]?.returned_quantity || 0} کیلوگرم
        </span>
      ),
    },
    {
      color: 'var(--color-warning)',
      title: '۳. انتساب به بهر تولیدی و کلید همبافت',
      body: (
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          لات: <code className="text-mono">{bridges[0]?.lot_id || 'LOT-GENERAL'}</code> | همبافت: <code className="text-mono">{bridges[0]?.hembaft_lot_key || 'N/A'}</code>
        </span>
      ),
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-box" style={{ background: isFailed ? 'var(--color-danger-bg)' : 'rgba(0,105,55,0.08)', color: isFailed ? 'var(--color-danger)' : 'var(--brand)' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>کاوش ریشه‌ای کیفیت (4-Hop Trace)</h2>
              <span className="text-muted" style={{ fontSize: '11px' }}>شکایت: {complaintId} | مشتری: {customerId}</span>
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Verdict */}
        <div className={`verdict-banner ${isFailed ? 'fail' : 'pass'}`}>
          <div className="verdict-title" style={{ color: isFailed ? 'var(--color-danger)' : 'var(--color-info)' }}>
            {isFailed ? <AlertOctagon size={18} /> : <CheckCircle2 size={18} />}
            <span>نتیجه نهایی: {data.investigation_verdict}</span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7' }}>{data.root_cause_analysis}</p>
        </div>

        {/* 4-Hop Graph */}
        <div className="hop-pipeline">
          {hops.map((hop, i) => (
            <div key={i}>
              {i > 0 && <div style={{ textAlign: 'center', padding: '4px 0' }}><ArrowDown size={16} className="hop-arrow" /></div>}
              <div className="hop-step">
                <span className="hop-step-title" style={{ color: hop.color }}>{hop.title}</span>
                <div className="hop-step-body">{hop.body}</div>
              </div>
            </div>
          ))}

          {/* Hop 4: Lab Results */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}><ArrowDown size={16} className="hop-arrow" /></div>
          <div className="hop-step">
            <span className="hop-step-title" style={{ color: 'var(--color-success)' }}>۴. نتایج آزمون آزمایشگاه کیفیت</span>
            {labs.length === 0 ? (
              <div className="text-muted" style={{ fontSize: '12px' }}>هیچ آزمون آزمایشگاهی یافت نشد.</div>
            ) : (
              <div className="data-table-container" style={{ marginTop: '8px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>شناسه آزمون</th>
                      <th>تاریخ</th>
                      <th>استحکام (cN/dtex)</th>
                      <th>ازدیاد طول %</th>
                      <th>یکنواختی (CV%)</th>
                      <th>نتیجه</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map((l: any) => (
                      <tr key={l.quality_record_id}>
                        <td className="text-mono">{l.quality_record_id}</td>
                        <td>{l.measured_at || l.production_date}</td>
                        <td className="text-mono">{l.tensile_strength_cn_dtex}</td>
                        <td className="text-mono">{(l.elongation_pct * 100)?.toFixed(1)}%</td>
                        <td className="text-mono">{(l.evenness_cv_pct * 100)?.toFixed(2)}%</td>
                        <td>
                          {l.lab_result === 'رد'
                            ? <span className="badge badge-risk-high">رد (مردود)</span>
                            : <span className="badge badge-risk-low">قبول</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>بستن</button>
        </div>
      </div>
    </div>
  );
};
