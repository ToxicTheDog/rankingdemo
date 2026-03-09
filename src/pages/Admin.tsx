import { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRanking, RankedUser } from "@/contexts/RankingContext";
import Header from "@/components/Header";
import RankBadge from "@/components/RankBadge";
import RankTitleBadge from "@/components/RankTitleBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, X, Search, Eye, Users, Coins, Wallet, Ban, Link2, CreditCard, Bitcoin, CheckCircle, Clock, History, Upload, ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/api";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { getRankTitle } from "@/lib/rank-titles";

/* ═══════════════════════════════════════
   MOCK DATA — Replace with real API data
   ═══════════════════════════════════════ */

interface AffiliateUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  active: boolean;
  joinDate: string;
  points: number;
  referrals: AffiliateUser[];
}

const mockAffiliateUsers: AffiliateUser[] = [
  {
    id: "a1", name: "Petar Simić", email: "petar@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petar", active: true, joinDate: "2025-11-15", points: 120,
    referrals: [
      { id: "a1-1", name: "Ivan Kostić", email: "ivan@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan", active: true, joinDate: "2025-12-01", points: 45, referrals: [] },
      { id: "a1-2", name: "Maja Pavlović", email: "maja@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maja", active: false, joinDate: "2025-12-10", points: 0, referrals: [] },
    ],
  },
  {
    id: "a2", name: "Milica Đorđević", email: "milica@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milica", active: true, joinDate: "2025-10-20", points: 230,
    referrals: [
      {
        id: "a2-1", name: "Lazar Nikolić", email: "lazar@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lazar", active: true, joinDate: "2026-01-05", points: 80, referrals: [
          { id: "a2-1-1", name: "Sara Ilić", email: "sara@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara", active: true, joinDate: "2026-01-20", points: 15, referrals: [] },
        ]
      },
    ],
  },
  {
    id: "a3", name: "Đorđe Marković", email: "djordje@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Djordje", active: false, joinDate: "2025-09-01", points: 50,
    referrals: [],
  },
  {
    id: "a4", name: "Tamara Janković", email: "tamara@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tamara", active: true, joinDate: "2025-12-25", points: 175,
    referrals: [
      { id: "a4-1", name: "Nemanja Stojanović", email: "nemanja@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nemanja", active: true, joinDate: "2026-01-10", points: 60, referrals: [] },
      { id: "a4-2", name: "Ana Popović", email: "ana.p@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaP", active: false, joinDate: "2026-01-15", points: 0, referrals: [] },
      { id: "a4-3", name: "Marko Vasić", email: "marko.v@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarkoV", active: true, joinDate: "2026-02-01", points: 30, referrals: [] },
    ],
  },
];

const pieData = [
  { name: "Forex", value: 32, color: "hsl(43, 77%, 38%)" },
  { name: "Crypto", value: 75, color: "hsl(43, 77%, 55%)" },
  { name: "Commodities", value: 12, color: "hsl(43, 40%, 25%)" },
  { name: "Metals", value: 34, color: "hsl(30, 60%, 45%)" },
];

interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
}

const demoTransactions: Transaction[] = [
  { id: "1", date: "2024-01-15", type: "income", category: "Prodaja", description: "Uplata fakture FAK-2024-001", amount: 9600, status: "completed" },
  { id: "2", date: "2024-01-20", type: "expense", category: "Nabavka", description: "Kupovina opreme", amount: 25000, status: "completed" },
  { id: "3", date: "2024-02-01", type: "expense", category: "Plate", description: "Isplata plata za januar", amount: 820000, status: "completed" },
  { id: "4", date: "2024-02-10", type: "income", category: "Prodaja", description: "Uplata fakture FAK-2024-005", amount: 550, status: "completed" },
  { id: "5", date: "2024-02-15", type: "expense", category: "Režije", description: "Struja i grejanje", amount: 45000, status: "completed" },
];

/* ═══════════════════════════════════════
   PAYOUT REQUEST TYPES & MOCK DATA
   ═══════════════════════════════════════ */

interface PayoutRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
  amount: number;
  points: number;
  rank: string;
  method: "bank" | "crypto";
  bankName?: string;
  iban?: string;
  swift?: string;
  network?: string;
  walletAddress?: string;
  referralCount: number;
  joinDate: string;
  requestDate: string;
}

interface PayoutHistoryItem extends PayoutRequest {
  approvedDate: string;
}

const initialPayoutRequests: PayoutRequest[] = [
  { id: "pr1", userId: "a1", name: "Petar Simić", email: "petar@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petar", amount: 250, points: 120, rank: "VIP", method: "bank", bankName: "UniCredit Bank", iban: "RS35260005601001611379", swift: "BACXRSBG", referralCount: 2, joinDate: "2025-11-15", requestDate: "2026-02-20" },
  { id: "pr2", userId: "a2", name: "Milica Đorđević", email: "milica@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milica", amount: 500, points: 230, rank: "Master", method: "crypto", network: "USDT (TRC-20)", walletAddress: "TXqZ8g1rN2vYz3kLP5dBn7mF4wJ6sE9cRa", referralCount: 1, joinDate: "2025-10-20", requestDate: "2026-02-21" },
  { id: "pr3", userId: "a4", name: "Tamara Janković", email: "tamara@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tamara", amount: 175, points: 175, rank: "Master", method: "bank", bankName: "Raiffeisen Bank", iban: "RS35265100000012345678", swift: "RZBSRSBG", referralCount: 3, joinDate: "2025-12-25", requestDate: "2026-02-22" },
];

/* ═══════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════ */

/** Affiliate user card with rank badge */
const UserCard = ({ user, rank, onPreview }: { user: AffiliateUser; rank: number; onPreview: (u: AffiliateUser) => void }) => (
  <Card className={`transition-all ${user.active ? "hover:border-gold/30 hover:shadow-md" : "opacity-60"}`}>
    <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
      <RankBadge rank={rank} size="sm" />
      <Avatar className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 ${!user.active ? "grayscale" : ""}`}>
        <AvatarImage src={user.imageUrl} alt={user.name} />
        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium truncate text-sm sm:text-base">{user.name}</p>
          {!user.active && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              <Ban className="h-2.5 w-2.5 mr-0.5" /> DEACTIVATED
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
          <span className="text-xs text-muted-foreground">{user.joinDate}</span>
          <span className="text-xs text-gold font-medium">{user.points} poena</span>
          <RankTitleBadge score={user.points} />
          {user.referrals.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <Users className="h-3 w-3" /> {user.referrals.length}
            </span>
          )}
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={() => onPreview(user)} className="shrink-0 text-xs sm:text-sm">
        <Eye className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Pregled</span>
      </Button>
    </CardContent>
  </Card>
);

/* ═══════════════════════════════════════
   MAIN ADMIN COMPONENT
   ═══════════════════════════════════════ */

const Admin = () => {
  const { isAdmin, token } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useRanking();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", score: "", imageUrl: "", specialty: "", students: "" });
  const [imageMode, setImageMode] = useState<"link" | "upload">("link");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [affSearch, setAffSearch] = useState("");
  const [previewUser, setPreviewUser] = useState<AffiliateUser | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<string>("");
  const [payoutForm, setPayoutForm] = useState({ bankName: "", iban: "", swift: "", walletAddress: "", network: "", amount: "" });
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(initialPayoutRequests);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>([]);
  const [requestDetail, setRequestDetail] = useState<PayoutRequest | null>(null);

  // if (!isAdmin) return <Navigate to="/login" replace />;

  const sorted = [...users].sort((a, b) => b.score - a.score);

  const resetForm = () => {
    setForm({ name: "", description: "", score: "", imageUrl: "", specialty: "", students: "" });
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setImageMode("link");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = form.imageUrl;

    // If upload mode and file selected, upload first
    if (imageMode === "upload" && imageFile && token) {
      try {
        setUploading(true);
        const res = await uploadImage(imageFile, token);
        imageUrl = res.url;
      } catch (err: any) {
        toast({ title: "Upload failed", description: err.message, variant: "destructive" });
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const data = {
      name: form.name, description: form.description, score: Number(form.score),
      imageUrl: imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
      specialty: form.specialty, students: Number(form.students) || 0,
    };
    if (editingId) {
      updateUser(editingId, data);
      toast({ title: "Ažurirano", description: `${data.name} je uspešno ažuriran.` });
    } else {
      addUser(data);
      toast({ title: "Dodato", description: `${data.name} je dodat na listu.` });
    }
    resetForm();
  };

  const startEdit = (user: RankedUser) => {
    setEditingId(user.id);
    setForm({ name: user.name, description: user.description, score: String(user.score), imageUrl: user.imageUrl, specialty: user.specialty, students: String(user.students) });
  };

  const handleDelete = (id: string, name: string) => {
    deleteUser(id);
    toast({ title: "Obrisano", description: `${name} je uklonjen sa liste.` });
    if (editingId === id) resetForm();
  };

  const filteredAffiliates = mockAffiliateUsers
    .filter((u) => u.name.toLowerCase().includes(affSearch.toLowerCase()) || u.email.toLowerCase().includes(affSearch.toLowerCase()))
    .sort((a, b) => b.points - a.points);

  const adminPoints = 1450;
  const totalReferrals = mockAffiliateUsers.length;
  const availablePayout = Math.floor(adminPoints * 0.5);

  const handlePayoutRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Zahtev poslat!", description: `Zahtev za payout od $${payoutForm.amount} putem ${payoutMethod === "bank" ? "banke" : "kripta"} je poslat.` });
    setPayoutForm({ bankName: "", iban: "", swift: "", walletAddress: "", network: "", amount: "" });
    setPayoutMethod("");
  };

  const handleApproveRequest = (req: PayoutRequest) => {
    setPayoutRequests((prev) => prev.filter((r) => r.id !== req.id));
    setPayoutHistory((prev) => [{ ...req, approvedDate: new Date().toISOString().split("T")[0] }, ...prev]);
    setRequestDetail(null);
    toast({ title: "Isplata poslata ✅", description: `$${req.amount} za ${req.name} je odobreno i poslato.` });
  };

  const dashboardStats = {
    totalRevenue: 2450000,
    totalExpenses: 1780000,
    profit: 670000,
    deactivated: 5,
    banned: 2,
    totalClients: 45,
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", minimumFractionDigits: 0 }).format(value);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Admin Panel</h1>

        <Tabs defaultValue="dashboard" className="space-y-6">
          {/* Responsive tab list — scrollable on mobile */}
          <TabsList className="flex w-full overflow-x-auto">
            <TabsTrigger value="dashboard" className="flex-1 min-w-[70px] text-xs sm:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="mentori" className="flex-1 min-w-[70px] text-xs sm:text-sm">Mentori</TabsTrigger>
            <TabsTrigger value="affiliate" className="flex-1 min-w-[70px] text-xs sm:text-sm">
              <Link2 className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Affiliate
            </TabsTrigger>
            <TabsTrigger value="payout" className="flex-1 min-w-[70px] text-xs sm:text-sm">
              <Wallet className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Payout
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1 min-w-[70px] text-xs sm:text-sm">
              <Clock className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Requests
              {payoutRequests.length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-gold text-gold-foreground border-0">{payoutRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 min-w-[70px] text-xs sm:text-sm">
              <History className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> History
            </TabsTrigger>
          </TabsList>

          {/* ═══ DASHBOARD TAB ═══ */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ukupni prihodi</CardTitle>
                  <DollarSign className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+12.5%</span>
                    <span className="ml-1">od prošlog meseca</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ukupni payout</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalExpenses)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                    <span className="text-destructive">+5.2%</span>
                    <span className="ml-1">od prošlog meseca</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gold">{formatCurrency(dashboardStats.profit)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+18.3%</span>
                    <span className="ml-1">od prošlog meseca</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <Users className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{dashboardStats.totalClients}</p>
                    <p className="text-sm text-muted-foreground">Ukupno klijenata</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Ban className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{dashboardStats.deactivated}</p>
                    <p className="text-sm text-muted-foreground">Deaktivirani</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{dashboardStats.banned}</p>
                    <p className="text-sm text-muted-foreground">Izbačeni</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts row */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Struktura prihoda</CardTitle>
                  <CardDescription>Po kategorijama</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                        formatter={(value: number) => `${value}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {pieData.map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Nedavne transakcije</CardTitle>
                  <CardDescription>Poslednja kretanja</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoTransactions.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${t.type === "income" ? "bg-green-500/15" : "bg-destructive/15"}`}>
                            {t.type === "income" ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{t.description}</p>
                            <p className="text-xs text-muted-foreground">{t.category}</p>
                          </div>
                        </div>
                        <div className={`shrink-0 text-sm font-medium ${t.type === "income" ? "text-green-500" : "text-destructive"}`}>
                          {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ═══ MENTORI TAB ═══ */}
          <TabsContent value="mentori" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editingId ? "Izmeni mentora" : "Dodaj novog mentora"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ime</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ime i prezime" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Ocena</Label>
                    <Input type="number" min="0" max="100" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} placeholder="0-100" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Specijalnost</Label>
                    <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="npr. Forex, Kripto..." required />
                  </div>
                  <div className="space-y-2">
                    <Label>Broj studenata</Label>
                    <Input type="number" min="0" value={form.students} onChange={(e) => setForm({ ...form, students: e.target.value })} placeholder="0" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Opis</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Kratak opis mentora" required />
                  </div>
                  <div className="space-y-3 sm:col-span-2">
                    <Label>Slika mentora</Label>
                    <div className="flex gap-2 mb-2">
                      <Button type="button" size="sm" variant={imageMode === "link" ? "default" : "outline"} onClick={() => setImageMode("link")}>
                        <Link2 className="h-3.5 w-3.5 mr-1" /> Link
                      </Button>
                      <Button type="button" size="sm" variant={imageMode === "upload" ? "default" : "outline"} onClick={() => setImageMode("upload")}>
                        <Upload className="h-3.5 w-3.5 mr-1" /> Upload
                      </Button>
                    </div>
                    {imageMode === "link" ? (
                      <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                    ) : (
                      <div className="space-y-2">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {imageFile ? imageFile.name : "Izaberi sliku..."}
                        </Button>
                        {imagePreview && (
                          <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 sm:col-span-2">
                    <Button type="submit" className="bg-gold hover:bg-gold/90 text-gold-foreground" disabled={uploading}>
                      {uploading ? "Uploading..." : editingId ? <><Save className="mr-1 h-4 w-4" /> Sačuvaj</> : <><Plus className="mr-1 h-4 w-4" /> Dodaj</>}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <X className="mr-1 h-4 w-4" /> Otkaži
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <h2 className="text-lg font-semibold sm:text-xl">Postojeći mentori ({users.length})</h2>
            <div className="space-y-3">
              {sorted.map((user, i) => (
                <Card key={user.id} className="transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                    <RankBadge rank={i + 1} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{user.specialty} • Ocena: {user.score} <RankTitleBadge score={user.score} className="ml-1" /></p>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id, user.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ═══ AFFILIATE TAB ═══ */}
          <TabsContent value="affiliate" className="space-y-6">
            {/* Admin profile */}
            <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                <Avatar className="h-14 w-14 ring-2 ring-gold/30 shrink-0 sm:h-16 sm:w-16">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold sm:text-xl">Admin Profil</h2>
                  <p className="text-sm text-muted-foreground">admin@ranking.com</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <Badge className="bg-gold/15 text-gold border-gold/30">
                      <Coins className="h-3 w-3 mr-1" /> {adminPoints} poena
                    </Badge>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" /> {totalReferrals} korisnika
                    </Badge>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-muted-foreground">Affiliate link</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">tradeacademy.com/ref/admin</code>
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pretraži korisnike..." value={affSearch} onChange={(e) => setAffSearch(e.target.value)} className="pl-9" />
            </div>

            <p className="text-sm text-muted-foreground">Moji korisnici ({filteredAffiliates.length})</p>

            <div className="space-y-3">
              {filteredAffiliates.map((user, i) => (
                <UserCard key={user.id} user={user} rank={i + 1} onPreview={setPreviewUser} />
              ))}
              {filteredAffiliates.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  Nema korisnika koji odgovaraju pretrazi.
                </div>
              )}
            </div>
          </TabsContent>

          {/* ═══ PAYOUT TAB ═══ */}
          <TabsContent value="payout" className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                <CardContent className="p-5 text-center sm:p-6">
                  <Coins className="mx-auto h-8 w-8 text-gold mb-2" />
                  <div className="text-3xl font-bold text-gold">{adminPoints}</div>
                  <p className="text-sm text-muted-foreground">Ukupno poena</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center sm:p-6">
                  <Wallet className="mx-auto h-8 w-8 text-gold mb-2" />
                  <div className="text-3xl font-bold">${availablePayout}</div>
                  <p className="text-sm text-muted-foreground">Dostupno za payout</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center sm:p-6">
                  <Users className="mx-auto h-8 w-8 text-gold mb-2" />
                  <div className="text-3xl font-bold">{totalReferrals}</div>
                  <p className="text-sm text-muted-foreground">Ukupno korisnika</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5" /> Zahtev za payout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayoutRequest} className="space-y-4 max-w-lg">
                  <div className="space-y-2">
                    <Label>Iznos ($)</Label>
                    <Input type="number" min="10" max={availablePayout} value={payoutForm.amount} onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })} placeholder={`Max: $${availablePayout}`} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Metod isplate</Label>
                    <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberi metod isplate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">
                          <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Bankarski transfer</span>
                        </SelectItem>
                        <SelectItem value="crypto">
                          <span className="flex items-center gap-2"><Bitcoin className="h-4 w-4" /> Kripto</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {payoutMethod === "bank" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label>Naziv banke</Label>
                        <Input value={payoutForm.bankName} onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })} placeholder="npr. UniCredit Bank" required />
                      </div>
                      <div className="space-y-2">
                        <Label>IBAN</Label>
                        <Input value={payoutForm.iban} onChange={(e) => setPayoutForm({ ...payoutForm, iban: e.target.value })} placeholder="RS35..." required />
                      </div>
                      <div className="space-y-2">
                        <Label>SWIFT/BIC</Label>
                        <Input value={payoutForm.swift} onChange={(e) => setPayoutForm({ ...payoutForm, swift: e.target.value })} placeholder="BACXRSBG" required />
                      </div>
                    </div>
                  )}

                  {payoutMethod === "crypto" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label>Mreža</Label>
                        <Select value={payoutForm.network} onValueChange={(v) => setPayoutForm({ ...payoutForm, network: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Izaberi mrežu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                            <SelectItem value="usdt-trc20">USDT (TRC-20)</SelectItem>
                            <SelectItem value="usdt-erc20">USDT (ERC-20)</SelectItem>
                            <SelectItem value="sol">Solana (SOL)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Wallet adresa</Label>
                        <Input value={payoutForm.walletAddress} onChange={(e) => setPayoutForm({ ...payoutForm, walletAddress: e.target.value })} placeholder="0x..." required />
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-gold-foreground" disabled={!payoutMethod || !payoutForm.amount}>
                    Podnesi zahtev za payout
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ REQUESTS TAB ═══ */}
          <TabsContent value="requests" className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" /> Zahtevi za isplatu ({payoutRequests.length})
            </h2>

            {payoutRequests.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="mx-auto h-10 w-10 mb-3 opacity-40" />
                  <p>Nema aktivnih zahteva za isplatu.</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {payoutRequests.map((req) => {
                const rankInfo = getRankTitle(req.points);
                return (
                  <Card key={req.id} className="hover:border-gold/30 transition-all">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={req.imageUrl} alt={req.name} />
                        <AvatarFallback>{req.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm sm:text-base">{req.name}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${rankInfo.bg} ${rankInfo.border} ${rankInfo.color}`}>
                            {rankInfo.icon} {rankInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {req.method === "bank" ? <CreditCard className="h-3 w-3" /> : <Bitcoin className="h-3 w-3" />}
                            {req.method === "bank" ? "Bank" : "Crypto"}
                          </span>
                          <span>{req.requestDate}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {req.referralCount}</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-gold shrink-0">${req.amount}</div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => setRequestDetail(req)}>
                          <Eye className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Detalji</span>
                        </Button>
                        <Button size="sm" className="bg-gold hover:bg-gold/90 text-gold-foreground" onClick={() => handleApproveRequest(req)}>
                          <CheckCircle className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ═══ HISTORY TAB ═══ */}
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-gold" /> Istorija isplata ({payoutHistory.length})
            </h2>

            {payoutHistory.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <History className="mx-auto h-10 w-10 mb-3 opacity-40" />
                  <p>Nema završenih isplata. Odobrite zahtev na Requests tabu.</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {payoutHistory.map((item) => {
                const rankInfo = getRankTitle(item.points);
                return (
                  <Card key={item.id + item.approvedDate} className="border-green-500/20">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/15 shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={item.imageUrl} alt={item.name} />
                        <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{item.name}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${rankInfo.bg} ${rankInfo.border} ${rankInfo.color}`}>
                            {rankInfo.icon} {rankInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                          <span>{item.method === "bank" ? "Bank" : "Crypto"}</span>
                          <span>Zahtev: {item.requestDate}</span>
                          <span className="text-green-500">Odobreno: {item.approvedDate}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-500 shrink-0">${item.amount}</div>
                      <Button size="sm" variant="ghost" onClick={() => setRequestDetail(item)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* User Preview Modal */}
      <Dialog open={!!previewUser} onOpenChange={(open) => !open && setPreviewUser(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil korisnika</DialogTitle>
          </DialogHeader>
          {previewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className={`h-14 w-14 sm:h-16 sm:w-16 shrink-0 ${!previewUser.active ? "grayscale" : ""}`}>
                  <AvatarImage src={previewUser.imageUrl} alt={previewUser.name} />
                  <AvatarFallback>{previewUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold">{previewUser.name}</h3>
                    {!previewUser.active && <Badge variant="destructive" className="text-[10px]">DEACTIVATED</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{previewUser.email}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">Pridružen: {previewUser.joinDate}</span>
                    <Badge className="bg-gold/15 text-gold border-gold/30 text-xs">{previewUser.points} poena</Badge>
                  </div>
                </div>
              </div>

              {previewUser.referrals.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Users className="h-4 w-4" /> Pozvani korisnici ({previewUser.referrals.length})
                  </h4>
                  <div className="space-y-2">
                    {previewUser.referrals.map((ref) => (
                      <Card key={ref.id} className={`${!ref.active ? "opacity-60" : ""}`}>
                        <CardContent className="flex items-center gap-3 p-3">
                          <Avatar className={`h-8 w-8 shrink-0 ${!ref.active ? "grayscale" : ""}`}>
                            <AvatarImage src={ref.imageUrl} alt={ref.name} />
                            <AvatarFallback className="text-xs">{ref.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-sm font-medium truncate">{ref.name}</p>
                              {!ref.active && <Badge variant="destructive" className="text-[9px] px-1 py-0">DEACTIVATED</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{ref.email}</p>
                          </div>
                          <span className="text-xs text-gold font-medium shrink-0">{ref.points}p</span>
                          {ref.referrals.length > 0 && (
                            <Button size="sm" variant="ghost" className="h-7 px-2 shrink-0" onClick={() => setPreviewUser(ref)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {previewUser.referrals.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Ovaj korisnik nije pozvao nikog.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Payout Request Detail Modal */}
      <Dialog open={!!requestDetail} onOpenChange={(open) => !open && setRequestDetail(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalji zahteva za isplatu</DialogTitle>
          </DialogHeader>
          {requestDetail && (() => {
            const rankInfo = getRankTitle(requestDetail.points);
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 shrink-0">
                    <AvatarImage src={requestDetail.imageUrl} alt={requestDetail.name} />
                    <AvatarFallback>{requestDetail.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{requestDetail.name}</h3>
                    <p className="text-sm text-muted-foreground">{requestDetail.email}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold mt-1 ${rankInfo.bg} ${rankInfo.border} ${rankInfo.color}`}>
                      {rankInfo.icon} {rankInfo.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Iznos</p>
                    <p className="text-xl font-bold text-gold">${requestDetail.amount}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Poeni</p>
                    <p className="text-xl font-bold">{requestDetail.points}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Referrals</p>
                    <p className="text-xl font-bold">{requestDetail.referralCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Član od</p>
                    <p className="text-sm font-medium">{requestDetail.joinDate}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    {requestDetail.method === "bank" ? <CreditCard className="h-4 w-4" /> : <Bitcoin className="h-4 w-4" />}
                    {requestDetail.method === "bank" ? "Bankarski podaci" : "Crypto podaci"}
                  </h4>
                  {requestDetail.method === "bank" ? (
                    <>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Banka:</span><span className="font-medium">{requestDetail.bankName}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">IBAN:</span><span className="font-mono text-xs">{requestDetail.iban}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">SWIFT:</span><span className="font-mono text-xs">{requestDetail.swift}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Mreža:</span><span className="font-medium">{requestDetail.network}</span></div>
                      <div className="text-sm"><span className="text-muted-foreground">Adresa:</span><p className="font-mono text-xs break-all mt-1">{requestDetail.walletAddress}</p></div>
                    </>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">Zahtev poslat: {requestDetail.requestDate}</p>

                {/* Only show approve button if it's still in requests (not history) */}
                {payoutRequests.some((r) => r.id === requestDetail.id) && (
                  <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground" onClick={() => handleApproveRequest(requestDetail)}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Odobri isplatu
                  </Button>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
