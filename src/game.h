/*
 * Copyright (C) 2013 Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef BLOCKCILLIN_GAME_H_
#define BLOCKCILLIN_GAME_H_

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "log.h"

class Game {
 public:
  int Run();

 private:
  bool InitWindow();
  bool InitGL();
  void Loop();
  void Render();
  void Quit();

  static const Log log;

  SDL_Window *window_ = nullptr;
  GLuint program_ = 0;
  GLuint vbo_ = 0;
  GLuint ibo_ = 0;
  GLint position_ = 0;
};

#endif // BLOCKCILLIN_GAME_H_
