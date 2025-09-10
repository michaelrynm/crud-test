<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Penitipan extends Model
{
    use HasFactory;

     protected $fillable = [
        'petName',
        'ownerName',
        'phoneNumber',
        'email',
        'jenis_hewan',
        'foto',
        'Tanggal_Penitipan',
        'Tanggal_Pengambilan',
        'biaya',
    ];  
    //
        protected $table = 'penitipan';
    protected $primaryKey = 'id';
    public $incrementing = true; 
    protected $keyType = 'int';


protected static function booted()
{
    static::creating(function ($model) {
        if (!empty($model->kode_penitipan)) {
            return;
        }

        $date = $model->Tanggal_Penitipan
            ? Carbon::parse($model->Tanggal_Penitipan)
            : Carbon::now();

        // pastikan terset
        $model->Tanggal_Penitipan = $date;

        $tanggal = $date->format('ymd'); // YYMMDD
        $jenis   = strtoupper($model->jenis_hewan ?? 'LAINNYA');

        // 🔥 Hapus whereDate, jadi sequence global berdasarkan jenis_hewan
        $last = self::whereRaw("UPPER(jenis_hewan) = ?", [$jenis])
            ->orderByRaw("CAST(SUBSTRING_INDEX(kode_penitipan,'/', -1) AS UNSIGNED) DESC")
            ->first();

        if ($last && preg_match('/\/(\d+)$/', $last->kode_penitipan, $m)) {
            $next = intval($m[1]) + 1;
        } else {
            $next = 1;
        }

        $model->kode_penitipan = "{$tanggal}/{$jenis}/{$next}";
    });
}


}
