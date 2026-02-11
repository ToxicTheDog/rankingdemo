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
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

const Admin = () => {
  const { isAdmin } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useRanking();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", description: "", score: "", imageUrl: "", specialty: "", students: "" });

  if (!isAdmin) return <Navigate to="/login" replace />;

  const sorted = [...users].sort((a, b) => b.score - a.score);

  const resetForm = () => {
    setForm({ name: "", description: "", score: "", imageUrl: "", specialty: "", students: "" });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      score: Number(form.score),
      imageUrl: form.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
      specialty: form.specialty,
      students: Number(form.students) || 0,
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>

        <Card className="mb-8">
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
                <Button type="submit">
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

        <h2 className="mb-4 text-xl font-semibold">Postojeći mentori ({users.length})</h2>
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
      </main>
    </div>
  );
};

export default Admin;
