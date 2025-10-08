<?php

use Illuminate\Support\Facades\Route;
use App\Models\Task;
use App\Models\Category;

Route::get('/', function () {
    return view('welcome');
});

Route::get('task', function(){
    return count(Task::all());
});

Route::get('categories', function(){
    return count(Category::all());
});
