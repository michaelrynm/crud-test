<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Penitipan>
 */
class PenitipanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jenis = ['ANJING', 'KUCING', 'KELINCI', 'REPTIL', 'LAINNYA'];
         $jenisHewan = $this->faker->randomElement($jenis);
        return [
            'petName'            => $this->faker->firstName,
            'ownerName'          => $this->faker->name,
            'phoneNumber'        => $this->faker->phoneNumber,
            'email'              => $this->faker->unique()->safeEmail,
            'jenis_hewan'        => $jenisHewan,
            'foto'               => 'penitipan/default.jpg',
            'Tanggal_Penitipan'  => $this->faker->dateTimeBetween('-1 month', 'now'),
            'Tanggal_Pengambilan'=> $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'biaya'              => $this->faker->numberBetween(50000, 200000),
        ];
    }
}
