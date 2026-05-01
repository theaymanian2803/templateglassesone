import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Edit2, X } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { name: "", slug: "", description: "", logo_url: "" };

export default function BrandsManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: typeof form) => {
      const payload = {
        name: f.name.trim(),
        slug: f.slug.trim() || f.name.trim().toLowerCase().replace(/\s+/g, "-"),
        description: f.description.trim() || null,
        logo_url: f.logo_url.trim() || null,
      };
      if (editingId) {
        const { error } = await supabase.from("brands").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("brands").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success(editingId ? "Brand updated" : "Brand added");
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Brand deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const startEdit = (b: any) => {
    setForm({ name: b.name, slug: b.slug, description: b.description || "", logo_url: b.logo_url || "" });
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    saveMutation.mutate(form);
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const inputClass = "w-full bg-transparent border border-border px-3 py-2 text-sm font-sans focus:outline-none focus:border-foreground transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl">Brands</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-luxury flex items-center gap-2 text-sm">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Brand</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-6 mb-6 space-y-4">
          <h3 className="font-serif text-lg">{editingId ? "Edit Brand" : "New Brand"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Brand name *" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} required />
            <input placeholder="Slug (auto-generated)" value={form.slug} onChange={(e) => update("slug", e.target.value)} className={inputClass} />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass + " min-h-[60px]"} />
          <input placeholder="Logo URL" value={form.logo_url} onChange={(e) => update("logo_url", e.target.value)} className={inputClass} />
          <button type="submit" disabled={saveMutation.isPending} className="btn-luxury disabled:opacity-50">
            {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Add Brand"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
      ) : brands.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No brands yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Brand</th>
                <th className="pb-3 font-medium text-muted-foreground">Slug</th>
                <th className="pb-3 font-medium text-muted-foreground">Description</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brands.map((b) => (
                <tr key={b.id} className="group">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {b.logo_url && <img src={b.logo_url} alt={b.name} className="w-6 h-6 object-contain" />}
                      <span className="font-medium">{b.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{b.slug}</td>
                  <td className="py-3 text-muted-foreground max-w-[200px] truncate">{b.description || "—"}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(b)} className="p-1.5 hover:text-foreground text-muted-foreground"><Edit2 size={14} /></button>
                      <button onClick={() => deleteMutation.mutate(b.id)} className="p-1.5 hover:text-destructive text-muted-foreground"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
