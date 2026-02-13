import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRanking, RankedUser } from "@/contexts/RankingContext";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Save, X, Search, Eye, Users, Coins, Wallet, Ban, Link2, CreditCard, Bitcoin } from "lucide-react";

// Mock affiliate data
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
      { id: "a2-1", name: "Lazar Nikolić", email: "lazar@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lazar", active: true, joinDate: "2026-01-05", points: 80, referrals: [
        { id: "a2-1-1", name: "Sara Ilić", email: "sara@email.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara", active: true, joinDate: "2026-01-20", points: 15, referrals: [] },
      ]},
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

const UserCard = ({ user, onPreview }: { user: AffiliateUser; onPreview: (u: AffiliateUser) => void }) => (
  <Card className={`transition-all ${user.active ? "hover:border-gold/30 hover:shadow-md" : "opacity-60"}`}>
    <CardContent className="flex items-center gap-4 p-4">
      <Avatar className={`h-12 w-12 ${!user.active ? "grayscale" : ""}`}>
        <AvatarImage src={user.imageUrl} alt={user.name} />
        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{user.name}</p>
          {!user.active && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              <Ban className="h-2.5 w-2.5 mr-0.5" /> DEACTIVATED
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground">{user.joinDate}</span>
          <span className="text-xs text-gold font-medium">{user.points} poena</span>
          {user.referrals.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <Users className="h-3 w-3" /> {user.referrals.length}
            </span>
          )}
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={() => onPreview(user)} className="shrink-0">
        <Eye className="h-4 w-4 mr-1" /> Pregled
      </Button>
    </CardContent>
  </Card>
);

const Admin = () => {
  const { isAdmin } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useRanking();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", score: "", imageUrl: "", specialty: "", students: "" });
  const [affSearch, setAffSearch] = useState("");
  const [previewUser, setPreviewUser] = useState<AffiliateUser | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<string>("");
  const [payoutForm, setPayoutForm] = useState({ bankName: "", iban: "", swift: "", walletAddress: "", network: "", amount: "" });

  if (!isAdmin) return <Navigate to="/login" replace />;

  const sorted = [...users].sort((a, b) => b.score - a.score);

  const resetForm = () => {
    setForm({ name: "", description: "", score: "", imageUrl: "", specialty: "", students: "" });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, description: form.description, score: Number(form.score),
      imageUrl: form.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
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

  // Affiliate filtering
  const filteredAffiliates = mockAffiliateUsers.filter(
    (u) => u.name.toLowerCase().includes(affSearch.toLowerCase()) || u.email.toLowerCase().includes(affSearch.toLowerCase())
  );

  // Mock admin stats
  const adminPoints = 1450;
  const totalReferrals = mockAffiliateUsers.length;
  const availablePayout = Math.floor(adminPoints * 0.5); // 50% conversion

  const handlePayoutRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Zahtev poslat!", description: `Zahtev za payout od $${payoutForm.amount} putem ${payoutMethod === "bank" ? "banke" : "kripta"} je poslat.` });
    setPayoutForm({ bankName: "", iban: "", swift: "", walletAddress: "", network: "", amount: "" });
    setPayoutMethod("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>

        <Tabs defaultValue="mentori" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mentori">Mentori</TabsTrigger>
            <TabsTrigger value="affiliate">
              <Link2 className="h-4 w-4 mr-1" /> Affiliate
            </TabsTrigger>
            <TabsTrigger value="payout">
              <Wallet className="h-4 w-4 mr-1" /> Payout
            </TabsTrigger>
          </TabsList>

          {/* ============ MENTORI TAB ============ */}
          <TabsContent value="mentori" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editingId ? "Izmeni mentora" : "Dodaj novog mentora"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
                  <div className="space-y-2 sm:col-span-2">
                    <Label>URL slike (opciono)</Label>
                    <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="flex gap-2 sm:col-span-2">
                    <Button type="submit" className="bg-gold hover:bg-gold/90 text-gold-foreground">
                      {editingId ? <><Save className="mr-1 h-4 w-4" /> Sačuvaj</> : <><Plus className="mr-1 h-4 w-4" /> Dodaj</>}
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

            <h2 className="text-xl font-semibold">Postojeći mentori ({users.length})</h2>
            <div className="space-y-3">
              {sorted.map((user, i) => (
                <Card key={user.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground">#{i + 1}</span>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.specialty} • Ocena: {user.score}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id, user.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ============ AFFILIATE TAB ============ */}
          <TabsContent value="affiliate" className="space-y-6">
            {/* Admin profile */}
            <Card className="border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
              <CardContent className="flex items-center gap-4 p-6">
                <Avatar className="h-16 w-16 ring-2 ring-gold/30">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">Admin Profil</h2>
                  <p className="text-sm text-muted-foreground">admin@ranking.com</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-gold/15 text-gold border-gold/30">
                      <Coins className="h-3 w-3 mr-1" /> {adminPoints} poena
                    </Badge>
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" /> {totalReferrals} korisnika
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Affiliate link</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">tradeacademy.com/ref/admin</code>
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pretraži korisnike..." value={affSearch} onChange={(e) => setAffSearch(e.target.value)} className="pl-9" />
            </div>

            <p className="text-sm text-muted-foreground">
              Moji korisnici ({filteredAffiliates.length})
            </p>

            {/* User cards */}
            <div className="space-y-3">
              {filteredAffiliates.map((user) => (
                <UserCard key={user.id} user={user} onPreview={setPreviewUser} />
              ))}
              {filteredAffiliates.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  Nema korisnika koji odgovaraju pretrazi.
                </div>
              )}
            </div>
          </TabsContent>

          {/* ============ PAYOUT TAB ============ */}
          <TabsContent value="payout" className="space-y-6">
            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <Coins className="mx-auto h-8 w-8 text-gold mb-2" />
                  <div className="text-3xl font-bold text-gold">{adminPoints}</div>
                  <p className="text-sm text-muted-foreground">Ukupno poena</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Wallet className="mx-auto h-8 w-8 text-gold mb-2" />
                  <div className="text-3xl font-bold">${availablePayout}</div>
                  <p className="text-sm text-muted-foreground">Dostupno za payout</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="mx-auto h-8 w-8 text-gold mb-2" />
                  <div className="text-3xl font-bold">{totalReferrals}</div>
                  <p className="text-sm text-muted-foreground">Ukupno korisnika</p>
                </CardContent>
              </Card>
            </div>

            {/* Payout request form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5" /> Zahtev za payout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayoutRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Iznos ($)</Label>
                    <Input
                      type="number"
                      min="10"
                      max={availablePayout}
                      value={payoutForm.amount}
                      onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                      placeholder={`Max: $${availablePayout}`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Metod isplate</Label>
                    <Select value={payoutMethod} onValueChange={setPayoutMethod} required>
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
                    <>
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
                    </>
                  )}

                  {payoutMethod === "crypto" && (
                    <>
                      <div className="space-y-2">
                        <Label>Mreža</Label>
                        <Select value={payoutForm.network} onValueChange={(v) => setPayoutForm({ ...payoutForm, network: v })} required>
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
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                    disabled={!payoutMethod || !payoutForm.amount}
                  >
                    Podnesi zahtev za payout
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* User Preview Modal */}
      <Dialog open={!!previewUser} onOpenChange={(open) => !open && setPreviewUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profil korisnika</DialogTitle>
          </DialogHeader>
          {previewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className={`h-16 w-16 ${!previewUser.active ? "grayscale" : ""}`}>
                  <AvatarImage src={previewUser.imageUrl} alt={previewUser.name} />
                  <AvatarFallback>{previewUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{previewUser.name}</h3>
                    {!previewUser.active && (
                      <Badge variant="destructive" className="text-[10px]">DEACTIVATED</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{previewUser.email}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">Pridružen: {previewUser.joinDate}</span>
                    <Badge className="bg-gold/15 text-gold border-gold/30 text-xs">
                      {previewUser.points} poena
                    </Badge>
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
                          <Avatar className={`h-8 w-8 ${!ref.active ? "grayscale" : ""}`}>
                            <AvatarImage src={ref.imageUrl} alt={ref.name} />
                            <AvatarFallback className="text-xs">{ref.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium truncate">{ref.name}</p>
                              {!ref.active && <Badge variant="destructive" className="text-[9px] px-1 py-0">DEACTIVATED</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{ref.email}</p>
                          </div>
                          <span className="text-xs text-gold font-medium">{ref.points}p</span>
                          {ref.referrals.length > 0 && (
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setPreviewUser(ref)}>
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
    </div>
  );
};

export default Admin;