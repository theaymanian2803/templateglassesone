import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Edit2, X } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { name: "", slug: "", description: "", image_url: "" };

export default function CategoriesManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
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
        image_url: f.image_url.trim() || null,
      };
      if (editingId) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(editingId ? "Category updated" : "Category added");
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const startEdit = (c: any) => {
    setForm({ name: c.name, slug: c.slug, description: c.description || "", image_url: c.image_url || "" });
    setEditingId(c.id);
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
        <h2 className="font-serif text-xl">Categories</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-luxury flex items-center gap-2 text-sm">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Category</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-6 mb-6 space-y-4">
          <h3 className="font-serif text-lg">{editingId ? "Edit Category" : "New Category"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Category name *" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} required />
            <input placeholder="Slug (auto-generated)" value={form.slug} onChange={(e) => update("slug", e.target.value)} className={inputClass} />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass + " min-h-[60px]"} />
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => update("image_url", e.target.value)} className={inputClass} />
          <button type="submit" disabled={saveMutation.isPending} className="btn-luxury disabled:opacity-50">
            {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Add Category"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No categories yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Name</th>
                <th className="pb-3 font-medium text-muted-foreground">Slug</th>
                <th className="pb-3 font-medium text-muted-foreground">Description</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((c) => (
                <tr key={c.id} className="group">
                  <td className="py-3 font-medium">{c.name}</td>
                  <td className="py-3 text-muted-foreground">{c.slug}</td>
                  <td className="py-3 text-muted-foreground max-w-[200px] truncate">{c.description || "—"}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(c)} className="p-1.5 hover:text-foreground text-muted-foreground"><Edit2 size={14} /></button>
                      <button onClick={() => deleteMutation.mutate(c.id)} className="p-1.5 hover:text-destructive text-muted-foreground"><Trash2 size={14} /></button>
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
