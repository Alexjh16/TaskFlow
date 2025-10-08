<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Category;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasks = [
            [
                'category_id' => 1, // Trabajo
                'title' => 'Revisar correos electrónicos',
                'description' => 'Verificar y responder los correos importantes del día',
                'is_completed' => false
            ],
            [
                'category_id' => 1, // Trabajo
                'title' => 'Completar informe mensual',
                'description' => 'Preparar el reporte de actividades del mes pasado',
                'is_completed' => true
            ],
            [
                'category_id' => 2, // Personal
                'title' => 'Llamar al médico',
                'description' => 'Agendar cita para chequeo médico anual',
                'is_completed' => false
            ],
            [
                'category_id' => 2, // Personal
                'title' => 'Comprar regalo de cumpleaños',
                'description' => 'Buscar y comprar regalo para María',
                'is_completed' => false
            ],
            [
                'category_id' => 3, // Estudios
                'title' => 'Estudiar para examen de matemáticas',
                'description' => 'Repasar capítulos 5-8 del libro de álgebra',
                'is_completed' => true
            ],
            [
                'category_id' => 3, // Estudios
                'title' => 'Entregar proyecto de programación',
                'description' => 'Finalizar y entregar el proyecto de TaskFlow',
                'is_completed' => false
            ],
            [
                'category_id' => 4, // Hogar
                'title' => 'Limpiar la cocina',
                'description' => 'Lavar platos y limpiar superficies',
                'is_completed' => true
            ],
            [
                'category_id' => 4, // Hogar
                'title' => 'Reparar la puerta del baño',
                'description' => 'Ajustar las bisagras de la puerta',
                'is_completed' => false
            ],
            [
                'category_id' => 5, // Ejercicio
                'title' => 'Ir al gimnasio',
                'description' => 'Rutina de pecho y tríceps',
                'is_completed' => false
            ],
            [
                'category_id' => 6, // Finanzas
                'title' => 'Revisar estado de cuenta',
                'description' => 'Verificar movimientos bancarios del mes',
                'is_completed' => true
            ]
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
