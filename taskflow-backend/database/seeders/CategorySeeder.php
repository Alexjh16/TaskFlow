<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Trabajo'],
            ['name' => 'Personal'],
            ['name' => 'Estudios'],
            ['name' => 'Hogar'],
            ['name' => 'Ejercicio'],
            ['name' => 'Finanzas'],
            ['name' => 'Proyectos'],
            ['name' => 'Viajes'],
            ['name' => 'Salud'],
            ['name' => 'Entretenimiento']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
