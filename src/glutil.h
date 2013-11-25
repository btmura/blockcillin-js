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

#ifndef BLOCKCILLIN_GL_UTIL_H_
#define BLOCKCILLIN_GL_UTIL_H_

#include "log.h"

class GLUtil {
 public:
  static GLuint CreateProgram(
      const std::string &vertex_shader_path,
      const std::string &fragment_shader_path);

 private:
  static GLuint CreateShader(const GLenum type, const std::string &path);

  static const Log log;
};

#endif // BLOCKCILLIN_GL_UTIL_H_
