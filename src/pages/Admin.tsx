import { useState, useRef, useEffect } from "react";
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
import { Plus, Pencil, Trash2, Save, X, Search, Eye, Users, Coins, Wallet, Ban, Link2, CreditCard, Bitcoin, CheckCircle, Clock, History, Upload, ImageIcon, Network, Loader2 } from "lucide-react";
import { uploadImage, getAffiliates, AffiliateData, getPayoutRequests, getPayoutHistory, approvePayout, submitPayoutRequest, getDashboardStats, getTransactions, getMyRanking, PayoutRequestData, PayoutHistoryData, TransactionData, resolveImageUrl } from "@/lib/api";
import { Link, useLocation } from "react-router-dom";

import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { getRankTitle } from "@/lib/rank-titles";

/** Affiliate user card with rank badge */
const UserCard = ({ user, rank, onPreview }: { user: AffiliateData; rank: number; onPreview: (u: AffiliateData) => void }) => (
  <Card className={`transition-all ${user.active ? "hover:border-gold/30 hover:shadow-md" : "opacity-60"}`}>
    <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
      <RankBadge rank={rank} size="sm" />
      <Avatar className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 ${!user.active ? "grayscale" : ""}`}>
        <AvatarImage src={resolveImageUrl(user.imageUrl)} alt={user.name} />
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
          {user.referrals && user.referrals.length > 0 && (
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
  const { isAdmin, token, user: authUser } = useAuth();
  const { users, addUser, updateUser, deleteUser, loading: mentorsLoading } = useRanking();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", score: "", imageUrl: "", specialty: "", students: "" });
  const [imageMode, setImageMode] = useState<"link" | "upload">("link");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [affSearch, setAffSearch] = useState("");
  const [previewUser, setPreviewUser] = useState<AffiliateData | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<string>("");
  const [payoutForm, setPayoutForm] = useState({ bankName: "", iban: "", swift: "", walletAddress: "", network: "", amount: "" });

  // API data state
  const [affiliates, setAffiliates] = useState<AffiliateData[]>([]);
  const [affiliatesLoading, setAffiliatesLoading] = useState(true);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequestData[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryData[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>({ totalAffiliates: 0, pendingPayouts: 0 });
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [requestDetail, setRequestDetail] = useState<PayoutRequestData | null>(null);
  const [myRanking, setMyRanking] = useState<any>(null);

  // Fetch all data on mount
  useEffect(() => {
    if (!token) return;

    getAffiliates(token)
      .then((res) => setAffiliates(res.data))
      .catch((err) => console.error("Affiliates error:", err))
      .finally(() => setAffiliatesLoading(false));

    getPayoutRequests(token)
      .then((res) => setPayoutRequests(res.data))
      .catch((err) => console.error("Payout requests error:", err))
      .finally(() => setRequestsLoading(false));

    getPayoutHistory(token)
      .then((res) => setPayoutHistory(res.data))
      .catch((err) => console.error("Payout history error:", err))
      .finally(() => setHistoryLoading(false));

    getDashboardStats(token)
      .then((res) => setDashboardStats(res.data))
      .catch((err) => console.error("Dashboard stats error:", err));

    getTransactions(token)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error("Transactions error:", err));

    getMyRanking(token)
      .then((res) => setMyRanking(res.data))
      .catch((err) => console.error("My ranking error:", err));
  }, [token]);

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

    setSubmitting(true);
    try {
      if (editingId) {
        await updateUser(editingId, data);
        toast({ title: "Ažurirano", description: `${data.name} je uspešno ažuriran.` });
      } else {
        await addUser(data);
        toast({ title: "Dodato", description: `${data.name} je dodat na listu.` });
      }
      resetForm();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (user: RankedUser) => {
    setEditingId(user.id);
    setForm({ name: user.name, description: user.description, score: String(user.score), imageUrl: user.imageUrl, specialty: user.specialty, students: String(user.students) });
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteUser(id);
      toast({ title: "Obrisano", description: `${name} je uklonjen sa liste.` });
      if (editingId === id) resetForm();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const filteredAffiliates = affiliates
    .filter((u) => u.name.toLowerCase().includes(affSearch.toLowerCase()) || u.email.toLowerCase().includes(affSearch.toLowerCase()))
    .sort((a, b) => b.points - a.points);

  const totalReferrals = affiliates.length;

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !authUser) return;
    try {
      const details: Record<string, string> = {};
      if (payoutMethod === "bank") {
        details.bankName = payoutForm.bankName;
        details.accountNumber = payoutForm.iban;
        details.iban = payoutForm.iban;
      } else {
        details.network = payoutForm.network;
        details.address = payoutForm.walletAddress;
      }
      await submitPayoutRequest({
        id: authUser.id,
        payout: {
          amount: Number(payoutForm.amount),
          type: payoutMethod === "bank" ? "bankTransfer" : "Crypto",
          details,
        },
      }, token);
      toast({ title: "Zahtev poslat!", description: `Zahtev za payout od $${payoutForm.amount} je poslat.` });
      setPayoutForm({ bankName: "", iban: "", swift: "", walletAddress: "", network: "", amount: "" });
      setPayoutMethod("");
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const handleApproveRequest = async (req: PayoutRequestData) => {
    if (!token) return;
    try {
      await approvePayout(req.id, token);
      setPayoutRequests((prev) => prev.filter((r) => r.id !== req.id));
      setPayoutHistory((prev) => [{ ...req, approvedDate: new Date().toISOString().split("T")[0] }, ...prev]);
      setRequestDetail(null);
      toast({ title: "Isplata poslata ✅", description: `$${req.amount} za ${req.name} je odobreno.` });
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", minimumFractionDigits: 0 }).format(value);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Admin Panel</h1>

        <Tabs defaultValue="dashboard" className="space-y-6">
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
            <Link key="/testing" to="/testing">
              <TabsTrigger value="network" className="flex-1 min-w-[70px] text-xs sm:text-sm">
                <Network className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Network
              </TabsTrigger>
            </Link>
          </TabsList>

          {/* ═══ DASHBOARD TAB ═══ */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Row 1: Financial KPIs */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ukupni prihodi</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue || 0)}</div>
                  {dashboardStats.revenueChange != null && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${dashboardStats.revenueChange >= 0 ? "text-green-500" : "text-destructive"}`}>
                      {dashboardStats.revenueChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {dashboardStats.revenueChange >= 0 ? "+" : ""}{dashboardStats.revenueChange}% od prošlog meseca
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ukupni payout</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalPayout || 0)}</div>
                  {dashboardStats.payoutChange != null && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${dashboardStats.payoutChange >= 0 ? "text-destructive" : "text-green-500"}`}>
                      {dashboardStats.payoutChange >= 0 ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                      {dashboardStats.payoutChange >= 0 ? "+" : ""}{dashboardStats.payoutChange}% od prošlog meseca
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{formatCurrency(dashboardStats.profit || 0)}</div>
                  {dashboardStats.profitChange != null && (
                    <p className="text-xs mt-1 flex items-center gap-1 text-green-500">
                      <ArrowUpRight className="h-3 w-3" />
                      +{dashboardStats.profitChange}% od prošlog meseca
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Row 2: Count KPIs */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15">
                    <Users className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardStats.totalClients ?? dashboardStats.totalAffiliates}</div>
                    <p className="text-xs text-muted-foreground">Ukupno klijenata</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Ban className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardStats.deactivated ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Deaktivirani</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-destructive">{dashboardStats.expelled ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Izbačeni</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Nedavne transakcije</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nema transakcija.</p>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((t) => (
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
                )}
              </CardContent>
            </Card>
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
                    <Button type="submit" className="bg-gold hover:bg-gold/90 text-gold-foreground" disabled={uploading || submitting}>
                      {uploading || submitting ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Sačekaj...</> : editingId ? <><Save className="mr-1 h-4 w-4" /> Sačuvaj</> : <><Plus className="mr-1 h-4 w-4" /> Dodaj</>}
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
            {mentorsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : (
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
            )}
          </TabsContent>

          {/* ═══ AFFILIATE TAB ═══ */}
          <TabsContent value="affiliate" className="space-y-6">
            {/* Admin Profile Header */}
            {myRanking && (
              <Card className="border-gold/30">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-gold/40">
                      <AvatarImage src={resolveImageUrl(myRanking.imageUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${myRanking.fullName || authUser?.username}`} alt={myRanking.fullName} />
                      <AvatarFallback>{(myRanking.fullName || authUser?.username || "A").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">{myRanking.fullName || authUser?.username || "Admin Profil"}</h3>
                      <p className="text-sm text-muted-foreground">{myRanking.email || authUser?.email}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className="bg-gold/15 text-gold border-gold/30 text-xs">
                          <Coins className="h-3 w-3 mr-1" /> {myRanking.totalPoints ?? myRanking.points ?? 0} poena
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" /> {myRanking.referralCount ?? affiliates.length} korisnika
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {myRanking.affiliateLink && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Affiliate link</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{myRanking.affiliateLink}</code>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pretraži korisnike..." value={affSearch} onChange={(e) => setAffSearch(e.target.value)} className="pl-9" />
            </div>

            {affiliatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : (
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
            )}
          </TabsContent>

          {/* ═══ PAYOUT TAB ═══ */}
          <TabsContent value="payout" className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="border-gold/30">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Coins className="h-6 w-6 text-gold mb-2" />
                  <div className="text-3xl font-bold text-gold">{myRanking?.totalPoints ?? myRanking?.points ?? 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ukupno poena</p>
                </CardContent>
              </Card>

              <Card className="border-gold/30">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Wallet className="h-6 w-6 text-gold mb-2" />
                  <div className="text-3xl font-bold text-gold">${myRanking?.availablePayout ?? Math.floor((myRanking?.totalPoints ?? 0) / 2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Dostupno za payout</p>
                </CardContent>
              </Card>

              <Card className="border-gold/30">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Users className="h-6 w-6 text-gold mb-2" />
                  <div className="text-3xl font-bold text-gold">{myRanking?.referralCount ?? affiliates.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ukupno korisnika</p>
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
                    <Input type="number" min="10" value={payoutForm.amount} onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })} placeholder="Iznos u dolarima" required />
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

            {requestsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : payoutRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="mx-auto h-10 w-10 mb-3 opacity-40" />
                  <p>Nema aktivnih zahteva za isplatu.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {payoutRequests.map((req) => {
                  const rankInfo = getRankTitle(req.points);
                  return (
                    <Card key={req.id} className="hover:border-gold/30 transition-all">
                      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={resolveImageUrl(req.imageUrl)} alt={req.name} />
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
            )}
          </TabsContent>

          {/* ═══ HISTORY TAB ═══ */}
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-gold" /> Istorija isplata ({payoutHistory.length})
            </h2>

            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : payoutHistory.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <History className="mx-auto h-10 w-10 mb-3 opacity-40" />
                  <p>Nema završenih isplata.</p>
                </CardContent>
              </Card>
            ) : (
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
                          <AvatarImage src={resolveImageUrl(item.imageUrl)} alt={item.name} />
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
            )}
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
                  <AvatarImage src={resolveImageUrl(previewUser.imageUrl)} alt={previewUser.name} />
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

              {previewUser.referrals && previewUser.referrals.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Users className="h-4 w-4" /> Pozvani korisnici ({previewUser.referrals.length})
                  </h4>
                  <div className="space-y-2">
                    {previewUser.referrals.map((ref) => (
                      <Card key={ref.id} className={`${!ref.active ? "opacity-60" : ""}`}>
                        <CardContent className="flex items-center gap-3 p-3">
                          <Avatar className={`h-8 w-8 shrink-0 ${!ref.active ? "grayscale" : ""}`}>
                            <AvatarImage src={resolveImageUrl(ref.imageUrl)} alt={ref.name} />
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
                          {ref.referrals && ref.referrals.length > 0 && (
                            <Button size="sm" variant="ghost" className="h-7 px-2 shrink-0" onClick={() => setPreviewUser(ref)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
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
                    <AvatarImage src={resolveImageUrl(requestDetail.imageUrl)} alt={requestDetail.name} />
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
