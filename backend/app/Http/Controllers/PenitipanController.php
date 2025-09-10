<?php

namespace App\Http\Controllers;

use App\Models\Penitipan;
use Illuminate\Http\Request;

class PenitipanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Penitipan::orderBy('created_at', 'desc')->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'petName' => 'required|string|max:255',
            'ownerName' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'email' => 'required|email',
            'jenis_hewan' => 'required|in:Anjing,Kucing,Kelinci,Reptil,Lainnya',
            'foto' => 'nullable|string',
            'Tanggal_Penitipan' => 'required|date',
            'Tanggal_Pengambilan' => 'nullable|date',
            'biaya' => 'nullable|numeric'
        ]);

            if ($request->hasFile('foto')) {
        $path = $request->file('foto')->store('penitipan', 'public'); 
        $validated['foto'] = $path;
    }

        $penitipan = Penitipan::create($validated);
        return response()->json($penitipan, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $penitipan = Penitipan::findOrFail($id);
    return response()->json($penitipan, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $validated = $request->validate([
        'Tanggal_Pengambilan' => 'required|date|after_or_equal:Tanggal_Penitipan',
        'biaya' => 'required|numeric|min:0',
    ]);

    $penitipan = Penitipan::findOrFail($id);
    $penitipan->update($validated);

    return response()->json($penitipan, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
