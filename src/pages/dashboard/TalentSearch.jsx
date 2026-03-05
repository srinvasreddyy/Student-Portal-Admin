import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Mail,
  X,
  Send,
  FolderOpen,
  Code,
  Briefcase,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Star,
  Globe,
  Github,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { adminApi } from "../../services/api";
import StudentProfileModal from "../../components/StudentProfileModal";

/* ─────────── Recruitment Email Modal ─────────── */
const RecruitmentEmailModal = ({ student, onClose }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    try {
      await adminApi.sendRecruitmentEmail({
        studentId: student._id,
        subject,
        body,
      });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send email");
    }
    setSending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 24px 50px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
            padding: "1.5rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                color: "#fff",
                margin: 0,
                fontSize: "1.25rem",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              <Send
                size={20}
                style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
              Send Recruitment Email
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                margin: "0.3rem 0 0",
                fontSize: "0.85rem",
              }}
            >
              To: {student.firstName} {student.lastName} ({student.email})
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: "0.4rem",
              borderRadius: "8px",
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "#ecfdf5",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Mail size={32} color="#10b981" />
            </div>
            <h3
              style={{
                color: "var(--text-primary)",
                fontFamily: "Outfit, sans-serif",
                marginBottom: "0.5rem",
              }}
            >
              Email Sent Successfully!
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Your recruitment email has been delivered to {student.email}
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSend}
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              overflowY: "auto",
              flex: 1,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Exciting Opportunity at Our Company"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                Email Body *
              </label>
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your recruitment message here..."
                rows={8}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.7,
                  minHeight: "180px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
                paddingTop: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                style={{
                  padding: "0.75rem 2rem",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 14px rgba(14, 165, 233, 0.3)",
                }}
              >
                <Send size={16} /> {sending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ─────────── Fallback Cover Images ─────────── */
const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop", // Code
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop", // Laptop
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop", // Desk setup
  "https://images.unsplash.com/photo-1627398246654-e8f3fb8d43dc?q=80&w=800&auto=format&fit=crop", // Abstract gradient tech
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", // Earth / network
];

const getFallbackImage = (id) => {
  if (!id) return DEFAULT_COVERS[0];
  const charCode = id.charCodeAt(id.length - 1);
  return DEFAULT_COVERS[charCode % DEFAULT_COVERS.length];
};

const getCoverUrl = (url, id) => {
  if (!url) return getFallbackImage(id);
  if (url.startsWith("/")) {
    const base = (
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    const cleanPath = url.replace(/^\/api\//, "/");
    return `${base}${cleanPath}`;
  }
  return url;
};

/* ─────────── Portfolio Result Card ─────────── */
const PortfolioResultCard = ({ item, onSelect }) => {
  const owner = item.ownerRef;
  const isApp = item.source === "app";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: "0 12px 30px rgba(14, 165, 233, 0.1)",
        borderColor: "rgba(14, 165, 233, 0.3)",
      }}
      onClick={() => onSelect(item)}
      style={{
        padding: 0,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "all 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Cover Image */}
      {item.coverImage || getFallbackImage(item._id) ? (
        <div
          style={{
            height: "140px",
            width: "100%",
            overflow: "hidden",
            background: "#f8fafc",
          }}
        >
          <img
            src={getCoverUrl(item.coverImage, item._id)}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            height: "6px",
            width: "100%",
            background: `linear-gradient(90deg, #8b5cf6, #ec4899)`,
          }}
        />
      )}

      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <h4
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {item.title}
            </h4>
            {item.description && (
              <p
                style={{
                  margin: "0.3rem 0 0",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.description}
              </p>
            )}
          </div>
          <span
            style={{
              padding: "0.25rem 0.6rem",
              borderRadius: "6px",
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              flexShrink: 0,
              background: isApp ? "#f0f9ff" : "#fdf4ff",
              color: isApp ? "#0369a1" : "#a21caf",
              border: `1px solid ${isApp ? "#bae6fd" : "#f0abfc"}`,
            }}
          >
            {isApp ? "🚀 App Project" : "📎 User Added"}
          </span>
        </div>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            {item.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: "0.2rem 0.5rem",
                  background: "#f1f5f9",
                  color: "#475569",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span
                style={{
                  padding: "0.2rem 0.5rem",
                  background: "#f1f5f9",
                  color: "#475569",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                }}
              >
                +{item.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Owner Info */}
        {owner && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid #f1f5f9",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              {(owner.firstName?.[0] || owner.email?.[0] || "?").toUpperCase()}
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {owner.firstName} {owner.lastName}
              </div>
              <div
                style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}
              >
                {owner.email}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────── Student Result Card ─────────── */
const StudentResultCard = ({ student, onSelect }) => {
  const user = student.userRef || {};
  const techStack = student.techStack || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: "0 12px 30px rgba(139, 92, 246, 0.1)",
        borderColor: "rgba(139, 92, 246, 0.3)",
      }}
      onClick={() => onSelect(student)}
      style={{
        padding: "1.25rem",
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {(user.firstName?.[0] || user.email?.[0] || "?").toUpperCase()}
        </div>
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {user.firstName} {user.lastName}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            {user.email}
          </p>
        </div>
      </div>

      {user.institutionName && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
          }}
        >
          <GraduationCap size={14} color="#0ea5e9" /> {user.institutionName}
        </div>
      )}

      {student.bio && (
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {student.bio}
        </p>
      )}

      {techStack.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.3rem",
            marginTop: "auto",
            paddingTop: "0.5rem",
          }}
        >
          {techStack.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              style={{
                padding: "0.2rem 0.5rem",
                background: "#f3e8ff",
                color: "#6b21a8",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span
              style={{
                padding: "0.2rem 0.5rem",
                background: "#f3e8ff",
                color: "#6b21a8",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              +{techStack.length - 4}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

/* ─────────── Student Detail Panel ─────────── */
const StudentDetailPanel = ({ student, portfolio, onBack, onEmailClick }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
  >
    {/* Header */}
    <div
      className="student-detail-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onBack}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            cursor: "pointer",
            display: "flex",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {student.firstName} {student.lastName}
          </h2>
          <p
            style={{
              margin: "0.2rem 0 0",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              wordBreak: "break-all",
            }}
          >
            {student.email}
          </p>
        </div>
      </div>
      <button
        className="mobile-full-width-btn"
        onClick={() => onEmailClick(student)}
        style={{
          padding: "0.75rem 1.5rem",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: "0 4px 14px rgba(14, 165, 233, 0.3)",
        }}
      >
        <Mail size={16} /> Send Recruitment Email
      </button>
    </div>

    {/* Student Info Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      {student.institutionName && (
        <div
          style={{
            padding: "1.25rem",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#e0f2fe",
              padding: "0.6rem",
              borderRadius: "10px",
            }}
          >
            <GraduationCap size={22} color="#0ea5e9" />
          </div>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Institution
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {student.institutionName}
            </div>
          </div>
        </div>
      )}
      {student.course && (
        <div
          style={{
            padding: "1.25rem",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#f3e8ff",
              padding: "0.6rem",
              borderRadius: "10px",
            }}
          >
            <BookOpen size={22} color="#8b5cf6" />
          </div>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Course
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {student.course}
            </div>
          </div>
        </div>
      )}
      {student.fieldOfStudy && (
        <div
          style={{
            padding: "1.25rem",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#ecfdf5",
              padding: "0.6rem",
              borderRadius: "10px",
            }}
          >
            <Star size={22} color="#10b981" />
          </div>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Field of Study
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {student.fieldOfStudy}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Portfolio Items */}
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.5rem",
      }}
    >
      <h3
        style={{
          margin: "0 0 1.25rem",
          fontSize: "1.1rem",
          fontFamily: "Outfit, sans-serif",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <FolderOpen size={20} color="#0ea5e9" /> Portfolio ({portfolio.length}{" "}
        items)
      </h3>
      {portfolio.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          <FolderOpen
            size={40}
            style={{ opacity: 0.5, margin: "0 auto 0.5rem", display: "block" }}
          />
          <p>No public portfolio items found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {portfolio.map((item) => (
            <div
              key={item._id}
              style={{
                padding: 0,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {item.coverImage || getFallbackImage(item._id) ? (
                <div
                  style={{
                    height: "140px",
                    width: "100%",
                    overflow: "hidden",
                    background: "#e2e8f0",
                  }}
                >
                  <img
                    src={getCoverUrl(item.coverImage, item._id)}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : null}
              <div style={{ padding: "1.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.title}
                  </h4>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      flexShrink: 0,
                      background: item.source === "app" ? "#f0f9ff" : "#fdf4ff",
                      color: item.source === "app" ? "#0369a1" : "#a21caf",
                      border: `1px solid ${item.source === "app" ? "#bae6fd" : "#f0abfc"}`,
                    }}
                  >
                    {item.source === "app" ? "🚀 App" : "📎 User"}
                  </span>
                </div>
                {item.description && (
                  <p
                    style={{
                      margin: "0 0 0.5rem",
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.description}
                  </p>
                )}

                {/* Project details for app-completed items */}
                {item.source === "app" && item.projectRef && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.75rem",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.projectRef.techStack?.map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            padding: "0.2rem 0.5rem",
                            background: "#e0f2fe",
                            color: "#0369a1",
                            borderRadius: "6px",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.projectRef.sourceCodeUrl && (
                        <a
                          href={item.projectRef.sourceCodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            color: "#0ea5e9",
                            textDecoration: "none",
                          }}
                        >
                          <Github size={14} /> Source Code
                        </a>
                      )}
                      {item.projectRef.productionUrl && (
                        <a
                          href={item.projectRef.productionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            color: "#10b981",
                            textDecoration: "none",
                          }}
                        >
                          <Globe size={14} /> Production
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {item.tags?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.3rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "0.15rem 0.4rem",
                          background: "#f1f5f9",
                          color: "#475569",
                          borderRadius: "4px",
                          fontSize: "0.65rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* External URL */}
                {item.url && !item.url.startsWith("/") && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      marginTop: "0.75rem",
                      fontSize: "0.8rem",
                      color: "#0ea5e9",
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={14} /> Open Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

/* ═══════════ MAIN TALENT SEARCH PAGE ═══════════ */
const TalentSearch = () => {
  const [activeTab, setActiveTab] = useState("portfolios"); // 'portfolios' | 'students'
  const [isMobile] = useState(window.innerWidth < 768);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    source: "",
    skills: "",
    institution: "",
    hasExperience: false,
    passoutYear: "",
    degreeCategory: "",
  });
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  // Student detail view
  const [viewMode, setViewMode] = useState("search"); // 'search' | 'detail'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentPortfolio, setStudentPortfolio] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Modals
  const [emailTarget, setEmailTarget] = useState(null);
  const [profileModalId, setProfileModalId] = useState(null);

  const performSearch = useCallback(
    async (pg = 1) => {
      setLoading(true);
      setSearched(true);
      try {
        if (activeTab === "portfolios") {
          const params = {
            page: pg,
            limit: 12,
            ...(query.trim() ? { q: query.trim() } : {}),
            ...(filters.source ? { source: filters.source } : {}),
            ...(filters.skills.trim() ? { skills: filters.skills.trim() } : {}),
            ...(filters.institution.trim()
              ? { institution: filters.institution.trim() }
              : {}),
            ...(filters.hasExperience ? { hasExperience: "true" } : {}),
          };
          const res = await adminApi.searchPortfolios(params);
          setResults(res.data.data || []);
          setTotal(res.data.total || 0);
        } else {
          const params = {
            page: pg,
            limit: 12,
            ...(query.trim() ? { q: query.trim() } : {}),
            ...(filters.passoutYear.trim()
              ? { passoutYear: filters.passoutYear.trim() }
              : {}),
            ...(filters.degreeCategory.trim()
              ? { degreeCategory: filters.degreeCategory.trim() }
              : {}),
            ...(filters.skills.trim() ? { skills: filters.skills.trim() } : {}),
            ...(filters.hasExperience ? { hasExperience: "true" } : {}),
          };
          const res = await adminApi.searchStudents(params);
          setResults(res.data.data || []);
          setTotal(res.data.total || 0);
        }
        setPage(pg);
      } catch (err) {
        console.error("Search failed:", err);
      }
      setLoading(false);
    },
    [query, filters, activeTab],
  );

  // Initial load and tab change
  useEffect(() => {
    performSearch(1);
  }, [activeTab]); // We don't map performSearch thoroughly into dependency perfectly to avoid jittery re-searches while typing filters. It triggers mainly on tab switching & manual search click.

  const handleSelectResult = async (item) => {
    const ownerId = item.ownerRef?._id;
    if (!ownerId) return;
    setLoadingDetail(true);
    try {
      const [profileRes, portfolioRes] = await Promise.all([
        adminApi.getStudentProfile(ownerId),
        adminApi.getStudentPortfolio(ownerId),
      ]);
      const profileData = profileRes.data.data;
      // Merge user info from the portfolio result owner
      const studentInfo = {
        _id: ownerId,
        firstName: item.ownerRef.firstName,
        lastName: item.ownerRef.lastName,
        email: item.ownerRef.email,
        institutionName: item.ownerRef.institutionName,
        course: item.ownerRef.course,
        fieldOfStudy: item.ownerRef.fieldOfStudy,
        ...profileData?.profile?.userRef,
        bio: profileData?.profile?.bio,
        techStack: profileData?.profile?.techStack,
        education: profileData?.profile?.education,
        experience: profileData?.profile?.experience,
      };
      setSelectedStudent(studentInfo);
      setStudentPortfolio(portfolioRes.data.data || []);
      setViewMode("detail");
    } catch (err) {
      console.error("Failed to load student details:", err);
      alert("Failed to load student details");
    }
    setLoadingDetail(false);
  };

  const handleSelectStudentResult = async (student) => {
    const ownerId = student.userRef?._id;
    if (!ownerId) return;
    setLoadingDetail(true);
    try {
      const portfolioRes = await adminApi.getStudentPortfolio(ownerId);
      const studentInfo = {
        _id: ownerId,
        firstName: student.userRef.firstName,
        lastName: student.userRef.lastName,
        email: student.userRef.email,
        institutionName: student.userRef.institutionName,
        course: student.userRef.course,
        fieldOfStudy: student.userRef.fieldOfStudy,
        bio: student.bio,
        techStack: student.techStack,
        education: student.education,
        experience: student.experience,
      };
      setSelectedStudent(studentInfo);
      setStudentPortfolio(portfolioRes.data.data || []);
      setViewMode("detail");
    } catch (err) {
      console.error("Failed to load student portfolio:", err);
      alert("Failed to load details");
    }
    setLoadingDetail(false);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    performSearch(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <style>{`
                @media (max-width: 768px) {
                    .talent-results-grid { grid-template-columns: 1fr !important; }
                    .mobile-full-width-btn { width: 100% !important; justify-content: center !important; }
                    .student-detail-header { flex-direction: column !important; align-items: stretch !important; }
                    .search-btn-mobile { width: 100% !important; justify-content: center !important; }
                    .search-input-mobile-wrapper { flex: 1 1 100% !important; }
                }
            `}</style>

      {viewMode === "search" ? (
        <>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                  fontFamily: "Outfit, sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                <Search
                  size={28}
                  style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                />
                Talent Search
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>
                Discover talented students by searching their portfolios or
                profiles.
              </p>
            </motion.div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "0.5rem",
              }}
            >
              <button
                onClick={() => {
                  setActiveTab("portfolios");
                  setViewMode("search");
                  setPage(1);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === "portfolios"
                      ? "3px solid #0ea5e9"
                      : "3px solid transparent",
                  color:
                    activeTab === "portfolios"
                      ? "#0ea5e9"
                      : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <FolderOpen
                  size={16}
                  style={{
                    verticalAlign: "middle",
                    marginRight: "0.4rem",
                    marginBottom: "2px",
                  }}
                />
                Portfolios
              </button>
              <button
                onClick={() => {
                  setActiveTab("students");
                  setViewMode("search");
                  setPage(1);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === "students"
                      ? "3px solid #8b5cf6"
                      : "3px solid transparent",
                  color:
                    activeTab === "students"
                      ? "#8b5cf6"
                      : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <User
                  size={16}
                  style={{
                    verticalAlign: "middle",
                    marginRight: "0.4rem",
                    marginBottom: "2px",
                  }}
                />
                Students
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(250px, 300px) 1fr",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            {/* Filters Sidebar */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "1.5rem",
                position: isMobile ? "static" : "sticky",
                top: isMobile ? "auto" : "2rem",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1.25rem",
                  fontSize: "1.1rem",
                  fontFamily: "Outfit, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Filter size={18} /> Filters
              </h3>

              {activeTab === "portfolios" && (
                <>
                  {/* Source */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Source
                    </label>
                    <select
                      value={filters.source}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          source: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem",
                        outline: "none",
                        background: "#f8fafc",
                      }}
                    >
                      <option value="">All Portfolios</option>
                      <option value="app">App Projects Only</option>
                      <option value="user">User Added Only</option>
                    </select>
                  </div>
                  {/* Institution */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Institution
                    </label>
                    <input
                      type="text"
                      value={filters.institution}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          institution: e.target.value,
                        }))
                      }
                      placeholder="e.g. Imperial College"
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem",
                        outline: "none",
                        background: "#f8fafc",
                      }}
                    />
                  </div>
                </>
              )}

              {activeTab === "students" && (
                <>
                  {/* Passout Year */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Passout Date/Year
                    </label>
                    <input
                      type="number"
                      value={filters.passoutYear}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          passoutYear: e.target.value,
                        }))
                      }
                      placeholder="e.g. 2025"
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem",
                        outline: "none",
                        background: "#f8fafc",
                      }}
                    />
                  </div>

                  {/* Degree Category */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Degree Category
                    </label>
                    <select
                      value={filters.degreeCategory}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          degreeCategory: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem",
                        outline: "none",
                        background: "#f8fafc",
                      }}
                    >
                      <option value="">Any Degree</option>
                      <option value="bachelor|bsc|undergrad">
                        Undergraduate (BSc, BA)
                      </option>
                      <option value="master|msc|postgrad">
                        Postgraduate (MSc, MA)
                      </option>
                      <option value="phd|doctorate">Doctorate (PhD)</option>
                      <option value="diploma|certificate">
                        Diploma / Certificate
                      </option>
                    </select>
                  </div>

                  {/* Experience */}
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="hasExpToggle"
                      checked={filters.hasExperience}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          hasExperience: e.target.checked,
                        }))
                      }
                      style={{ cursor: "pointer", accentColor: "var(--primary)" }}
                    />
                    <label
                      htmlFor="hasExpToggle"
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      Must have Work Experience
                    </label>
                  </div>
                </>
              )}

              {/* Shared Filters */}
              {/* Skills */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Required Skills
                </label>
                <input
                  type="text"
                  value={filters.skills}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, skills: e.target.value }))
                  }
                  placeholder="e.g. react, node"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                    background: "#f8fafc",
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setFilters({
                    source: "",
                    skills: "",
                    institution: "",
                    hasExperience: false,
                    passoutYear: "",
                    degreeCategory: "",
                  });
                  setQuery("");
                  performSearch(1);
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Clear All
              </button>
            </div>

            {/* Main Content Area */}
            <div>
              {/* Search Bar */}
              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="search-input-mobile-wrapper"
                  style={{ flex: 1, minWidth: "250px", position: "relative" }}
                >
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      activeTab === "portfolios"
                        ? "Search portfolios by title, description..."
                        : "Search students by name, email..."
                    }
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem 0.875rem 2.75rem",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: "all 0.2s",
                      background: "#fff",
                      fontFamily: "inherit",
                      minWidth: 0,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0ea5e9";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(14,165,233,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="search-btn-mobile"
                  style={{
                    padding: "0.875rem 2rem",
                    borderRadius: "12px",
                    background: loading
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
                    border: "none",
                    color: "#fff",
                    cursor: loading ? "default" : "pointer",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(14, 165, 233, 0.3)",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <Search size={16} /> {loading ? "Searching..." : "Search"}
                </button>
              </motion.form>

              {/* Results */}
              {loadingDetail && (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "3px solid #e0f2fe",
                      borderTopColor: "var(--primary)",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto 1rem",
                    }}
                  />
                  Loading student details...
                </div>
              )}

              {loading ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "180px",
                        background: "#f1f5f9",
                        borderRadius: "14px",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    />
                  ))}
                </div>
              ) : searched && results.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                  }}
                >
                  <Search
                    size={48}
                    style={{
                      color: "#cbd5e1",
                      margin: "0 auto 1rem",
                      display: "block",
                    }}
                  />
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    No Results Found
                  </h3>
                  <p style={{ color: "var(--text-secondary)" }}>
                    Try different keywords or broader search terms.
                  </p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "1rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Found <strong>{total}</strong> matching {activeTab}
                  </p>
                  <div
                    className="talent-results-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {activeTab === "portfolios"
                      ? results.map((item) => (
                        <PortfolioResultCard
                          key={item._id}
                          item={item}
                          onSelect={handleSelectResult}
                        />
                      ))
                      : results.map((student) => (
                        <StudentResultCard
                          key={student._id}
                          student={student}
                          onSelect={handleSelectStudentResult}
                        />
                      ))}
                  </div>

                  {/* Pagination */}
                  {total > 12 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.5rem",
                        marginTop: "2rem",
                      }}
                    >
                      <button
                        disabled={page <= 1}
                        onClick={() => performSearch(page - 1)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          cursor: page <= 1 ? "default" : "pointer",
                          color: page <= 1 ? "#cbd5e1" : "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        Previous
                      </button>
                      <span
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Page {page}
                      </span>
                      <button
                        disabled={results.length < 12}
                        onClick={() => performSearch(page + 1)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          cursor: results.length < 12 ? "default" : "pointer",
                          color:
                            results.length < 12
                              ? "#cbd5e1"
                              : "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        selectedStudent && (
          <StudentDetailPanel
            student={selectedStudent}
            portfolio={studentPortfolio}
            onBack={() => setViewMode("search")}
            onEmailClick={setEmailTarget}
          />
        )
      )
      }

      {/* Modals */}
      <AnimatePresence>
        {emailTarget && (
          <RecruitmentEmailModal
            student={emailTarget}
            onClose={() => setEmailTarget(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {profileModalId && (
          <StudentProfileModal
            studentId={profileModalId}
            onClose={() => setProfileModalId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div >
  );
};

export default TalentSearch;
