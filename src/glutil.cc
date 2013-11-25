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

#include <string>

#include "GL/glew.h"

#include "glutil.h"
#include "ioutil.h"

const Log GLUtil::log("glutil");

GLuint GLUtil::CreateProgram(
    const std::string &vertex_shader_path,
    const std::string &fragment_shader_path) {
  GLuint program = glCreateProgram();
  if (program == 0) {
    log.Errorf("glCreateProgram failed");
    return 0;
  }

  GLuint vertex_shader = CreateShader(GL_VERTEX_SHADER, "data/vertex-shader.txt");
  if (vertex_shader == 0) {
    log.Errorf("CreateShader for GL_VERTEX_SHADER failed");
    return 0;
  }

  GLuint fragment_shader = CreateShader(GL_FRAGMENT_SHADER, "data/fragment-shader.txt");
  if (fragment_shader == 0) {
    log.Errorf("CreateShader for GL_FRAGMENT_SHADER failed");
    return 0;
  }

  glAttachShader(program, vertex_shader);
  glAttachShader(program, fragment_shader);

  glLinkProgram(program);
  GLint success = GL_TRUE;
  glGetProgramiv(program, GL_LINK_STATUS, &success);
  if (success != GL_TRUE) {
    log.Errorf("glLinkProgram failed");
    return 0;
  }

  glDeleteShader(vertex_shader);
  glDeleteShader(fragment_shader);

  return program;
}

GLuint GLUtil::CreateShader(const GLenum type, const std::string &path) {
  GLuint shader = glCreateShader(type);
  if (shader == 0) {
    log.Errorf("glCreateShader for type %d failed", type);
    return 0;
  }

  std::string source;
  if (!IOUtil::ReadFile(path, &source)) {
    log.Errorf("ReadFile on %s failed", path.c_str());
    return 0;
  }

  const GLchar* sources[] = {source.c_str()};
  glShaderSource(shader, 1, sources, nullptr);
  glCompileShader(shader);

  GLint success = GL_TRUE;
  glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
  if (success != GL_TRUE) {
    GLint info_log_length;
    glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &info_log_length);

    GLchar *info_log = new GLchar[info_log_length];
    glGetShaderInfoLog(shader, info_log_length, nullptr, info_log);
    log.Errorf("glCompileShader for type %d failed: %s", type, info_log);
    delete[] info_log;

    return 0;
  }

  return shader;
}