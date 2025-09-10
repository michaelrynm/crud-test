<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penitipan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_penitipan');
            $table->string('petName');
            $table->string('ownerName');
            $table->string('phoneNumber');
            $table->string('email');

            $table->enum('jenis_hewan', ['ANJING', 'KUCING', 'KELINCI', 'REPTIL', 'LAINNYA']);

            $table->string('foto')->nullable();

            $table->dateTime('Tanggal_Penitipan');
            $table->dateTime('Tanggal_Pengambilan')->nullable();
            $table->decimal('biaya',10,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penitipan');
    }
};
