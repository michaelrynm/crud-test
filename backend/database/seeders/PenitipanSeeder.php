<?php

namespace Database\Seeders;

use App\Models\Penitipan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PenitipanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Penitipan::factory()->count(20)->create();
    }
}
